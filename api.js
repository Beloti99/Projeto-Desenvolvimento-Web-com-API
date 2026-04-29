// src/services/api.js

// ATENÇÃO: Cole o seu Token da Trefle na variável abaixo:
const TREFLE_TOKEN = 'usr-ZBWbh3AIws-VOEK42k5IWk7F4AxW6Qw4BW9bixuYQpE';
const BASE_URL = 'https://trefle.io/api/v1';

// Usamos um proxy cors pois a Trefle API pode bloquear chamadas diretas do navegador (CORS)
const CORS_PROXY = 'https://cors.eu.org/';

const dicionarioPlantas = {
  'rose': 'Rosa', 'cactus': 'Cacto', 'succulent': 'Suculenta', 'fern': 'Samambaia',
  'orchid': 'Orquídea', 'lily': 'Lírio', 'palm': 'Palmeira', 'sunflower': 'Girassol',
  'lavender': 'Lavanda', 'basil': 'Manjericão', 'mint': 'Hortelã', 'rosemary': 'Alecrim',
  'apple': 'Macieira', 'lemon': 'Limoeiro', 'tomato': 'Tomateiro', 'strawberry': 'Morango',
  'banana': 'Bananeira', 'coconut': 'Coqueiro', 'coffee': 'Cafeeiro', 'bamboo': 'Bambu',
  'eucalyptus': 'Eucalipto', 'cedar': 'Cedro', 'pine': 'Pinheiro', 'oak': 'Carvalho',
  'maple': 'Bordo', 'cherry': 'Cerejeira', 'snake plant': 'Espada-de-são-jorge',
  'spider plant': 'Paulistinha', 'peace lily': 'Lírio-da-paz', 'fiddle leaf fig': 'Ficus lyrata',
  'monstera': 'Costela-de-adão', 'pothos': 'Jiboia', 'philodendron': 'Filodendro',
  'zz plant': 'Zamioculca', 'rubber plant': 'Ficus elastica', 'jade plant': 'Planta-jade',
  'aloe vera': 'Babosa', 'aloe': 'Babosa', 'agave': 'Agave'
};

const traduzirNome = (englishName) => {
  if (!englishName) return '';
  const lower = englishName.toLowerCase();

  // Busca exata
  if (dicionarioPlantas[lower]) return dicionarioPlantas[lower];

  // Busca parcial (se a palavra estiver contida)
  for (const [eng, pt] of Object.entries(dicionarioPlantas)) {
    if (lower.includes(eng)) return pt;
  }

  // Se não achar tradução, retornamos vazio para não mostrar inglês
  return '';
};

const getCategory = (name, scientificName) => {
  const str = ((name || '') + ' ' + (scientificName || '')).toLowerCase();
  if (str.includes('tree') || str.includes('palm') || str.includes('fir') || str.includes('pine') || str.includes('oak')) return 'Árvores';
  if (str.includes('flower') || str.includes('orchid') || str.includes('lily') || str.includes('rose') || str.includes('bloom') || str.includes('aster')) return 'Flores';
  return 'Folhagens';
};

const mapTreflePlant = (p) => {
  const nomeTraduzido = traduzirNome(p.common_name);
  return {
    id: String(p.id),
    nome: p.scientific_name || 'Desconhecido', // Nome científico como título principal (universal)
    nomeCientifico: nomeTraduzido ? `Nome comum: ${nomeTraduzido}` : '',
    categoria: getCategory(p.common_name, p.scientific_name),
    tipo: p.family || 'Planta',
    cicloDeVida: 'Perene', // Simplificado
    rega: 'Moderada',
    luz: 'Meia-sombra',
    dificuldade: 'Média',
    petFriendly: false,
    imagem: p.image_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/800px-No_image_available.svg.png',
    descricao: 'Esta é uma bela planta adicionada ao nosso catálogo. (Detalhes extraídos via Trefle Plant API)'
  };
};

export const fetchPlantas = async () => {
  if (!TREFLE_TOKEN || TREFLE_TOKEN === 'COLE_SEU_TOKEN_AQUI') {
    console.error("TOKEN DA TREFLE NÃO CONFIGURADO");
    return [];
  }

  try {
    // Fazemos buscas simultâneas focadas em espécies populares, ampliando as opções
    const queries = [
      'monstera', 'sansevieria', 'philodendron', 'fern', 'ficus', 'anthurium',
      'calathea', 'peperomia', 'begonia', 'orchid', 'rose', 'pine', 'oak',
      'spathiphyllum', 'epipremnum', 'syngonium', 'tulip', 'lily', 'cedar'
    ];

    // Fazemos as requisições em sequência para evitar erro 429 (Too Many Requests) nos proxies gratuitos
    let todasAsPlantas = [];
    for (const q of queries) {
      try {
        const res = await fetch(`${CORS_PROXY}${encodeURIComponent(`${BASE_URL}/plants/search?token=${TREFLE_TOKEN}&q=${q}`)}`);
        if (res.ok) {
          const result = await res.json();
          if (result && result.data) {
            todasAsPlantas = [...todasAsPlantas, ...result.data];
          }
        }
      } catch (e) {
        // Ignora erro dessa busca específica e continua
      }
      // Pequeno atraso para não estourar o limite de requisições por segundo do proxy
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Filtramos para ter no máximo 1 variedade por espécie (baseado nas duas primeiras palavras do nome científico)
    const especiesVistas = new Set();
    const plantasUnicasPorEspecie = [];

    todasAsPlantas.forEach(p => {
      if (!p.image_url) return; // Retorna apenas as que têm imagem
      if (!p.scientific_name) return;

      const nomeBase = p.scientific_name.split(' ').slice(0, 2).join(' ').toLowerCase();
      if (!especiesVistas.has(nomeBase)) {
        especiesVistas.add(nomeBase);
        plantasUnicasPorEspecie.push(p);
      }
    });

    return plantasUnicasPorEspecie.map(mapTreflePlant);

  } catch (error) {
    console.error("Erro na requisição da Trefle API:", error);
    return [];
  }
};

export const fetchPlantaById = async (id) => {
  if (TREFLE_TOKEN === 'COLE_SEU_TOKEN_AQUI') return null;

  try {
    const response = await fetch(`${CORS_PROXY}${encodeURIComponent(`${BASE_URL}/species/${id}?token=${TREFLE_TOKEN}`)}`);
    if (!response.ok) {
      throw new Error('Erro ao buscar detalhes da Trefle API');
    }
    const json = await response.json();
    const p = json.data;

    const nomeTraduzido = traduzirNome(p.common_name);

    let descricaoFinal = 'Uma belíssima planta disponível em nosso catálogo. Suas características únicas a tornam uma excelente escolha para complementar o seu ambiente. (Detalhes da Trefle API)';

    // Busca uma descrição real na Wikipedia em inglês usando o nome científico
    let englishDesc = '';
    try {
      const wikiRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro&explaintext&titles=${encodeURIComponent(p.scientific_name)}&format=json&origin=*`);
      const wikiJson = await wikiRes.json();
      const pages = wikiJson.query?.pages;
      if (pages) {
        const extract = Object.values(pages)[0].extract;
        if (extract) {
          // Pega até as 2 primeiras frases para não sobrecarregar a API de tradução
          englishDesc = extract.split('. ').slice(0, 2).join('. ') + '.';
        }
      }
    } catch (e) {
      console.error("Falha ao buscar na Wikipedia:", e);
    }

    // Se encontrou texto na Wikipedia, traduz para português
    if (englishDesc) {
      try {
        const transRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(englishDesc)}&langpair=en|pt`);
        const transJson = await transRes.json();
        if (transJson && transJson.responseData && transJson.responseData.translatedText) {
          descricaoFinal = transJson.responseData.translatedText;
        }
      } catch (e) {
        console.error("Falha ao traduzir descrição:", e);
      }
    }

    return {
      id: String(p.id),
      nome: p.scientific_name || 'Planta',
      nomeCientifico: nomeTraduzido ? `Nome comum: ${nomeTraduzido}` : '',
      categoria: getCategory(p.common_name, p.scientific_name),
      tipo: p.family || 'Planta',
      cicloDeVida: p.duration ? p.duration.join(', ') : 'Perene',
      rega: 'Moderada',
      luz: 'Meia-sombra',
      dificuldade: 'Média',
      petFriendly: false,
      imagem: p.image_url || 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/800px-No_image_available.svg.png',
      descricao: descricaoFinal
    };
  } catch (error) {
    console.error("Erro na requisição de detalhes da Trefle API:", error);
    return null;
  }
};
