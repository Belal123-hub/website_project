function getData(number) {
    let data = [];
    data[0] = [
        ["outlook",     "temperature",  "humidity",     "windy",    "play"  ],
        ["overcast",    "hot",          "high",         "FALSE",    "yes"   ],
        ["overcast",    "cool",         "normal",       "TRUE",     "yes"   ],
        ["overcast",    "mild",         "high",         "TRUE",     "yes"   ],
        ["overcast",    "hot",          "normal",       "FALSE",    "yes"   ],
        ["rainy",       "mild",         "high",         "FALSE",    "yes"   ],
        ["rainy",       "cool",         "normal",       "FALSE",    "yes"   ],
        ["rainy",       "cool",         "normal",       "TRUE",     "no"    ],
        ["rainy",       "mild",         "normal",       "FALSE",    "yes"   ],
        ["rainy",       "mild",         "high",         "TRUE",     "no"    ],
        ["sunny",       "hot",          "high",         "FALSE",    "no"    ],
        ["sunny",       "hot",          "high",         "TRUE",     "no"    ],
        ["sunny",       "mild",         "high",         "FALSE",    "no"    ],
        ["sunny",       "cool",         "normal",       "FALSE",    "yes"   ],
        ["sunny",       "mild",         "normal",       "TRUE",     "yes"   ]
    ];
    
    return data[number]
}