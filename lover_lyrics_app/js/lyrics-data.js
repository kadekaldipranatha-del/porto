/**
 * Lyrics dataset for Jeff Buckley's "Lover, You Should've Come Over"
 * Includes precise timestamps, section markers, poetic translations, and chord data.
 */
const LYRICS_DATA = [
    {
        id: "intro-01",
        time: 0,
        endTime: 24,
        section: "Intro / Atmosphere",
        tag: "harmonium & acoustic",
        chord: "Dmaj7 - G6 - Em9",
        quote: "Looking out the door I see the rain fall upon the funeral mourners...",
        lines: [
            "Looking out the door I see the rain fall upon the funeral mourners",
            "Parading in a wake of sad relations as their shoes fill up with water"
        ],
        translation: "Menatap ke luar pintu kulihat hujan membasahi para pelayat duka, berbaris dalam iringan kerabat berduka saat sepatu mereka tergenang air...",
        mood: "melancholy",
        color: "amber",
        initialPos: { x: 6, y: 14 }
    },
    {
        id: "intro-02",
        time: 24,
        endTime: 46,
        section: "Intro Part II",
        tag: "quiet ache",
        chord: "D/F# - G - A7sus4",
        quote: "Maybe I'm too young to keep good love from going wrong...",
        lines: [
            "Maybe I'm too young to keep good love from going wrong",
            "But tonight you're on my mind so you never know"
        ],
        translation: "Mungkin aku terlalu muda tuk menjaga cinta sejati tak tersesat, namun malam ini bayangmu memenuhi benakku...",
        mood: "yearning",
        color: "sepia",
        initialPos: { x: 64, y: 10 }
    },
    {
        id: "verse1-01",
        time: 46,
        endTime: 68,
        section: "Verse 1",
        tag: "confession",
        chord: "D - G/B - A",
        quote: "Broken down and hungry for your love with no way to feed it...",
        lines: [
            "Broken down and hungry for your love with no way to feed it",
            "Where are you tonight, child, you know how much I need it"
        ],
        translation: "Hancur lebur dan begitu lapar akan cintamu tanpa cara tuk memuaskannya, di manakah dirimu malam ini...",
        mood: "longing",
        color: "warm-glow",
        initialPos: { x: 35, y: 20 }
    },
    {
        id: "verse1-02",
        time: 68,
        endTime: 92,
        section: "Verse 1 (Cont.)",
        tag: "nostalgia",
        chord: "Bm - F#m - G - A",
        quote: "Too young to hold on and too old to just break run and cry...",
        lines: [
            "Too young to hold on and too old to just break run and cry",
            "Sweet lover, you should've come over"
        ],
        translation: "Terlalu muda tuk bertahan, dan terlalu tua tuk lari dan menangis... Kekasih manis, seharusnya kau datang kemari...",
        mood: "poetic",
        color: "gold",
        initialPos: { x: 10, y: 46 }
    },
    {
        id: "verse2-01",
        time: 92,
        endTime: 120,
        section: "Verse 2",
        tag: "morning haze",
        chord: "Dmaj9 - G6 - Em7",
        quote: "Looking at the morning street I wonder how it was so easily broken...",
        lines: [
            "Looking at the morning street I wonder how it was so easily broken",
            "Well I feel too young to hold on, and I'm much too old to break run and cry"
        ],
        translation: "Memandang jalanan pagi, kubertanya bagaimana semua bisa begitu mudah hancur...",
        mood: "introspective",
        color: "sepia",
        initialPos: { x: 68, y: 38 }
    },
    {
        id: "chorus-01",
        time: 120,
        endTime: 152,
        section: "Chorus I",
        tag: "heart of song",
        chord: "G - D/F# - Em7 - A - D",
        quote: "Oh, love... well it's not too late...",
        lines: [
            "Oh, love, well I'm waiting for you",
            "Yes, I'm waiting for you",
            "Lover, you should've come over",
            "Cause it's not too late"
        ],
        translation: "Oh cinta, aku menunggumu... Kekasih, seharusnya kau datang padaku, karena belum terlambat...",
        mood: "crescendo",
        color: "amber",
        initialPos: { x: 38, y: 52 }
    },
    {
        id: "verse3-01",
        time: 152,
        endTime: 182,
        section: "Verse 3",
        tag: "deep regret",
        chord: "D - G/B - Asus4",
        quote: "My youth is the only thing for me that is stolen away...",
        lines: [
            "My youth is the only thing for me that is stolen away",
            "I see all of my dreams turn into ash and blow away"
        ],
        translation: "Masa mudaku adalah satu-satunya hal yang tercuri dariku, kusaksikan seluruh impianku menjelma abu dan terbang tertiup angin...",
        mood: "despair",
        color: "dark-amber",
        initialPos: { x: 6, y: 72 }
    },
    {
        id: "verse3-02",
        time: 182,
        endTime: 215,
        section: "Verse 3 (Cont.)",
        tag: "poetic peak",
        chord: "Bm - F#m - G - A",
        quote: "She's a tear that hangs inside my soul forever...",
        lines: [
            "She's a tear that hangs inside my soul forever",
            "It brings me down to think of all the promises never kept"
        ],
        translation: "Dia adalah tetesan air mata yang menggantung abadi di dalam jiwaku...",
        mood: "heartbreak",
        color: "gold",
        initialPos: { x: 52, y: 74 }
    },
    {
        id: "bridge-01",
        time: 215,
        endTime: 255,
        section: "Bridge / Climax",
        tag: "vocal soaring",
        chord: "F#m - G - Bm - A - D",
        quote: "It's never over, all my blood for the sweetness of her laughter...",
        lines: [
            "It's never over, all my blood for the sweetness of her laughter",
            "It's never over, she's the tear that hangs inside my soul forever"
        ],
        translation: "Ini takkan pernah berakhir, seluruh darahku demi manisnya tawa miliknya...",
        mood: "ecstasy",
        color: "warm-glow",
        initialPos: { x: 24, y: 32 }
    },
    {
        id: "bridge-02",
        time: 255,
        endTime: 295,
        section: "Bridge Part II",
        tag: "pleading soul",
        chord: "D/F# - Gmaj7 - A9",
        quote: "Well maybe I'm just too young... to keep good love from going wrong...",
        lines: [
            "Well maybe I'm just too young",
            "To keep good love from going wrong",
            "Oh, Lover, you should've come over..."
        ],
        translation: "Mungkin aku hanya terlalu muda tuk menjaga cinta sejati tak salah arah... Oh Kekasih, seharusnya kau datang...",
        mood: "vulnerable",
        color: "amber",
        initialPos: { x: 75, y: 62 }
    },
    {
        id: "outro-01",
        time: 295,
        endTime: 340,
        section: "Outro / Fade",
        tag: "gentle release",
        chord: "Dmaj7 - G - Em9 - D",
        quote: "Lover, you should've come over... I'm waiting for you...",
        lines: [
            "Lover, you should've come over",
            "Oh, I feel too young to hold on",
            "And much too old to just break run and cry",
            "Sweet lover, you should've come over..."
        ],
        translation: "Kekasih, seharusnya kau datang... Terlalu muda tuk bertahan, terlalu tua tuk menangis...",
        mood: "peaceful",
        color: "sepia",
        initialPos: { x: 42, y: 10 }
    },
    {
        id: "outro-02",
        time: 340,
        endTime: 395,
        section: "Final Whisper",
        tag: "eternal echo",
        chord: "D(add9) - G/D - D",
        quote: "Cause it's not too late... it's not too late...",
        lines: [
            "Cause it's not too late...",
            "It's not too late...",
            "Lover, you should've come over"
        ],
        translation: "Karena ini belum terlambat... sungguh belum terlambat...",
        mood: "transcendent",
        color: "gold",
        initialPos: { x: 18, y: 84 }
    }
];

// Additional floating thought fragments / poetic whispers for floating storm density
const POETIC_FRAGMENTS = [
    { text: "“Looking out the door I see the rain...”", author: "Jeff Buckley", tag: "Grace (1994)", x: 82, y: 18 },
    { text: "“She's a tear that hangs inside my soul forever.”", author: "Track 07", tag: "Poetry", x: 15, y: 30 },
    { text: "“Too young to hold on, too old to break run and cry.”", author: "Lover, You Should've Come Over", tag: "Iconic", x: 60, y: 26 },
    { text: "“All my blood for the sweetness of her laughter.”", author: "Jeff Buckley", tag: "Passion", x: 30, y: 64 },
    { text: "“Broken down and hungry for your love with no way to feed it.”", author: "Midnight Reflection", tag: "Ache", x: 80, y: 78 },
    { text: "“My youth is the only thing for me that is stolen away.”", author: "Grace", tag: "Memory", x: 4, y: 58 },
    { text: "“It's not too late.”", author: "Whisper", tag: "Hope", x: 48, y: 84 },
    { text: "“Where are you tonight, child...”", author: "Echoes in the dark", tag: "Night", x: 70, y: 48 }
];
