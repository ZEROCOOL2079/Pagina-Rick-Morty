document.addEventListener('DOMContentLoaded', () => {
    // Función para cargar un personaje aleatorio
    async function loadRandomCharacter() {
        try {
            const response = await fetch('https://rickandmortyapi.com/api/character');
            const data = await response.json();
            const totalCharacters = data.info.count;
            const randomId = Math.floor(Math.random() * totalCharacters) + 1;

            const charResponse = await fetch(`https://rickandmortyapi.com/api/character/${randomId}`);
            const character = await charResponse.json();

            const featuredCharacterDiv = document.getElementById('featured-character');
            if (character) {
                featuredCharacterDiv.innerHTML = `
                    <img src="${character.image}" alt="${character.name}">
                    <h3>${character.name}</h3>
                    <p>Especie: ${character.species}</p>
                    <p>Estado: ${character.status}</p>
                `;
            } else {
                featuredCharacterDiv.innerHTML = '<p>No se pudo cargar el personaje.</p>';
            }

        } catch (error) {
            console.error('Error al cargar el personaje aleatorio:', error);
            document.getElementById('featured-character').innerHTML = '<p>Error al cargar el personaje.</p>';
        }
    }

    loadRandomCharacter();
});