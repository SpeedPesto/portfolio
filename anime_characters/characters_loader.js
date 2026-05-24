const naruto_classic = [];
const naruto_quator = [];
const naruto_7epeistes = [];
const naruto_bidjus_et_invocations = [];
const naruto_pain = [];

const jojo_characters = [];
const jojo_stands = [];

let is_characters_loaded = false;

async function fetch_characters(isData = null) {
    if (is_characters_loaded) return;

    let response = await fetch('../anime_characters/anime_characters.json');
    if (isData) { response = await fetch('../anime_characters/anime_characters_data.json'); }
    
    const data = await response.json();

    naruto_classic.push(...data.naruto_classic);
    naruto_quator.push(...data.naruto_quator);
    naruto_7epeistes.push(...data.naruto_7epeistes);
    naruto_bidjus_et_invocations.push(...data.naruto_bidjus_et_invocations);
    naruto_pain.push(...data.naruto_pain);

    jojo_characters.push(...data.jojo_characters);
    jojo_stands.push(...data.jojo_stands);

    is_characters_loaded = true;
}