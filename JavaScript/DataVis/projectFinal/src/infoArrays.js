export {
    classInfo,
    raceInfo,
    classes,
    races
}

//defining basic arrays to include all classes and races so .includes can be used
const classes = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard', 'Other'];

const races = ['Dragonborn', 'Dwarf', 'Elf', 'Gnome', 'Half-Elf', 'Halfling', 'Half-Orc', 'Human', 'Tiefling', 'Aarakocra', 'Genasi', 'Goliath', 'Aasimar', 'Bugbear', 'Firbolg', 'Goblin', 'Hobgoblin', 'Kenku',
'Kobold', 'Lizardfolk', 'Orc', 'Tabaxi', 'Triton', 'Tortle', 'Yuan-ti'];

//defining array of info for each class with name, color, and transform for where the zoom should go when its clicked
const classInfo = [
    {
        class: 'Barbarian',
        color: '#E7623E',
        angle: 27,
        transform: {
            k: 2.070529847682755,
            x: -1984.5036454235092,
            y: -1173.798991690154
        }
    },
    {
        class: 'Bard',
        color: '#AB6DAC',
        angle: 54,
        transform: {
            k: 2.5491212546385245,
            x: -2642.643868654767,
            y: -2081.157254591717
        }
    },
    {
        class: 'Cleric',
        color: '#91A1B2',
        angle: 81,
        transform: {
            k: 2.070529847682755,
            x: -1312.3481213560335,
            y: -1811.5113241735326
        }
    },
    {
        class: 'Druid',
        color: '#7A853B',
        angle: 108,
        transform: {
            k: 2.070529847682755,
            x: -881.1701113315671,
            y: -1841.37981723851
        }
    },
    {
        class: 'Fighter',
        color: '#7F513E',
        angle: 135,
        transform: {
            k: 1.6817928305074292,
            x: -110.32920005527376,
            y: -1134.3573279929383
        }
    },
    {
        class: 'Monk',
        color: '#51A5C5',
        angle: 162,
        transform: {
            k: 2.5491212546385245,
            x: -286.567298510912,
            y: -1464.2806335397213
        }
    },
    {
        class: 'Paladin',
        color: '#B59E54',
        angle: 189,
        transform: {
            k: 2.29739670999407,
            x: -153.26826266383546,
            y: -609.0652055225235
        }
    },
    {
        class: 'Ranger',
        color: '#507F62',
        angle: 216,
        transform: {
            k: 2.29739670999407,
            x: -373.3022611622473,
            y: -23.916589334023627
        }
    },
    {
        class: 'Rogue',
        color: '#555752',
        angle: 243,
        transform: {
            k: 1.866065983073615,
            x: -496.05611594140896,
            y: 367.9266037595103
        }
    },
    {
        class: 'Sorcerer',
        color: '#992E2E',
        angle: 270,
        transform: {
            k: 2.070529847682755,
            x: -1544.5562294918723,
            y: 459.94388405859104
        }
    },
    {
        class: 'Warlock',
        color: '#7B469B',
        angle: 297,
        transform: {
            k: 2.5491212546385245,
            x: -2826.440553026573,
            y: 222.2582950961853
        }
    },
    {
        class: 'Wizard',
        color: '#2A50A1',
        angle: 324,
        transform: {
            k: 2.5491212546385245,
            x: -3345.440553026573,
            y: -234.7417049038146
        }
    },
    {
        class: 'Other',
        color: 'black',
        angle: 355,
        transform: {
            k: 3.1383363915870035,
            x: -4041.870804919937,
            y: -1081.1018094397143
        }
    }
];

//defining array of info for races with name and color
//no position since they always go to the same place
const raceInfo = [
    {
        name: 'Dragonborn',
        color: '#c97a45'
    },
    {
        name: 'Dwarf',
        color: '#c9cfd3'
    },
    {
        name: 'Elf',
        color: '#ebd0c9'
    },
    {
        name: 'Gnome',
        color: '#b7a368'
    },
    {
        name: 'Half-Elf',
        color: '#9370DB'
    },
    {
        name: 'Halfling',
        color: '#543429'
    },
    {
        name: 'Half-Orc',
        color: '#E6E6FA'
    },
    {
        name: 'Human',
        color: 'blue'
    },
    {
        name: 'Tiefling',
        color: 'red'
    },
    {
        name: 'Aarakocra',
        color: '#E7BD64'
    },
    {
        name: 'Genasi',
        color: '#282424'
    },
    {
        name: 'Goliath',
        color: '#787F49'
    },
    {
        name: 'Aasimar',
        color: 'yellow'
    },
    {
        name: 'Bugbear',
        color: '#823C12'
    },
    {
        name: 'Firbolg',
        color: '#AEB2AF'
    },
    {
        name: 'Goblin',
        color: '#DF9F50'
    },
    {
        name: 'Hobgoblin',
        color: '#BC604B'
    },
    {
        name: 'Kenku',
        color: '#848695'
    },
    {
        name: 'Kobold',
        color: '#6D251F'
    },
    {
        name: 'Lizardfolk',
        color: '#74954B'
    },
    {
        name: 'Orc',
        color: '#70645B'
    },
    {
        name: 'Tabaxi',
        color: 'orange'
    },
    {
        name: 'Triton',
        color: '#B1DAE8'
    },
    {
        name: 'Tortle',
        color: '#2c493f '
    },
    {
        name: 'Yuan-ti', 
        color: '#8B008B'
    },
    {
        name: 'Other',
        color: 'white'
    }
]
