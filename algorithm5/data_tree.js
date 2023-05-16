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
    
    data[3] = [
        ["usd",     "lamphat",  "nctt",     "slkt",     "play " ],
        ["TANG",    "GIAM",     "THAP",     "TB",       "THAP " ],
        ["TANG",    "TANG",     "THAP",     "TB",       "CAO "  ],
        ["TANG",    "ON DINH",  "CAO",      "TB",       "CAO "  ],
        ["TANG",    "TANG",     "THAP",     "THAP",     "CAO "  ],
        ["TANG",    "GIAM",     "TB",       "THAP",     "CAO "  ],
        ["TANG",    "GIAM",     "CAO",      "THAP",     "THAP " ],
        ["TB",      "ON DINH",  "TB",       "CAO",      "THAP " ],
        ["TB",      "GIAM",     "THAP",     "CAO",      "THAP " ],
        ["TB",      "TANG",     "TB",       "THAP",     "THAP " ],
        ["TB",      "ON DINH",  "CAO",      "TB",       "CAO "  ],
        ["TB",      "GIAM",     "CAO",      "CAO",      "CAO "  ],
        ["GIAM",    "ON DINH",  "CAO",      "THAP",     "THAP " ],
        ["GIAM",    "GIAM",     "CAO",      "CAO",      "CAO "  ],
        ["GIAM",    "TANG",     "CAO",      "TB",       "THAP " ],
        ["GIAM",    "TANG",     "THAP",     "THAP",     "THAP " ],
        ["GIAM",    "ON DINH",  "CAO",      "TB",       "CAO "  ]
    ];

    return data[number]
}