'use strict';
// Dati predefiniti estratti dai file Word (dieta e lista spesa), caricati al primo avvio.
const DEFAULT_DATA = {
 "plan": {
  "days": [
   {
    "n": 1,
    "meals": [
     {
      "name": "Colazione",
      "title": "",
      "items": [
       {
        "raw": "70g di pane",
        "name": "Pane",
        "qty": 70,
        "unit": "g",
        "label": "70 g",
        "note": ""
       },
       {
        "raw": "80g formaggio spalmabile",
        "name": "Formaggio spalmabile",
        "qty": 80,
        "unit": "g",
        "label": "80 g",
        "note": ""
       },
       {
        "raw": "20g di miele (2 cucchiaini)",
        "name": "Miele",
        "qty": 20,
        "unit": "g",
        "label": "20 g",
        "note": "2 cucchiaini"
       },
       {
        "raw": "10g di frutta secca (es. 5-6 mandorle, 1-2 noci, 5-6 anacardi ecc.)",
        "name": "Frutta secca",
        "qty": 10,
        "unit": "g",
        "label": "10 g",
        "note": "es. 5-6 mandorle, 1-2 noci, 5-6 anacardi ecc."
       },
       {
        "raw": "3/4 mandrole",
        "name": "Mandrole",
        "qty": 3.5,
        "unit": "pz",
        "label": "3-4 pz",
        "note": ""
       }
      ]
     },
     {
      "name": "Spuntino",
      "title": "",
      "items": [
       {
        "raw": "1 mela",
        "name": "Mela",
        "qty": 1,
        "unit": "pz",
        "label": "1 pz",
        "note": ""
       },
       {
        "raw": "20g di frutta secca",
        "name": "Frutta secca",
        "qty": 20,
        "unit": "g",
        "label": "20 g",
        "note": ""
       }
      ]
     },
     {
      "name": "Pranzo",
      "title": "Panino con pesto, mozzarella e pomodori",
      "items": [
       {
        "raw": "150g di pane",
        "name": "Pane",
        "qty": 150,
        "unit": "g",
        "label": "150 g",
        "note": ""
       },
       {
        "raw": "25g di pate di olive",
        "name": "Pate di olive",
        "qty": 25,
        "unit": "g",
        "label": "25 g",
        "note": ""
       },
       {
        "raw": "5g di grana",
        "name": "Grana",
        "qty": 5,
        "unit": "g",
        "label": "5 g",
        "note": ""
       },
       {
        "raw": "2 mozzarelle light da 100-125g",
        "name": "Mozzarelle light",
        "qty": 225,
        "unit": "g",
        "label": "2 × 100-125 g",
        "note": ""
       },
       {
        "raw": "150-200g di pomodori",
        "name": "Pomodori",
        "qty": 175,
        "unit": "g",
        "label": "150-200 g",
        "note": ""
       }
      ]
     },
     {
      "name": "Merenda",
      "title": "",
      "items": [
       {
        "raw": "20g di grana",
        "name": "Grana",
        "qty": 20,
        "unit": "g",
        "label": "20 g",
        "note": ""
       },
       {
        "raw": "30g di crackers (1 pacchetto)",
        "name": "Crackers",
        "qty": 30,
        "unit": "g",
        "label": "30 g",
        "note": "1 pacchetto"
       }
      ]
     },
     {
      "name": "Cena",
      "title": "Carne arrosto con insalata di patate e verdure",
      "items": [
       {
        "raw": "150g di pane",
        "name": "Pane",
        "qty": 150,
        "unit": "g",
        "label": "150 g",
        "note": ""
       },
       {
        "raw": "200g di carne magra di vitello",
        "name": "Carne magra di vitello",
        "qty": 200,
        "unit": "g",
        "label": "200 g",
        "note": ""
       },
       {
        "raw": "150-200g di zucchine",
        "name": "Zucchine",
        "qty": 175,
        "unit": "g",
        "label": "150-200 g",
        "note": ""
       },
       {
        "raw": "2 cucchiaini di olio di oliva extra vergine",
        "name": "Olio di oliva extra vergine",
        "qty": 10,
        "unit": "ml",
        "label": "2 cucchiaini",
        "note": ""
       }
      ]
     }
    ]
   },
   {
    "n": 2,
    "meals": [
     {
      "name": "Colazione",
      "title": "",
      "items": [
       {
        "raw": "150g di yogurt greco bianco 0% sl",
        "name": "Yogurt greco bianco 0% sl",
        "qty": 150,
        "unit": "g",
        "label": "150 g",
        "note": ""
       },
       {
        "raw": "40g di biscotti",
        "name": "Biscotti",
        "qty": 40,
        "unit": "g",
        "label": "40 g",
        "note": ""
       },
       {
        "raw": "1 pera",
        "name": "Pera",
        "qty": 1,
        "unit": "pz",
        "label": "1 pz",
        "note": ""
       },
       {
        "raw": "10g di frutta secca (es. 5-6 mandorle, 1-2 noci, 5-6 anacardi ecc.)",
        "name": "Frutta secca",
        "qty": 10,
        "unit": "g",
        "label": "10 g",
        "note": "es. 5-6 mandorle, 1-2 noci, 5-6 anacardi ecc."
       }
      ]
     },
     {
      "name": "Spuntino",
      "title": "",
      "items": [
       {
        "raw": "50g di pane",
        "name": "Pane",
        "qty": 50,
        "unit": "g",
        "label": "50 g",
        "note": ""
       },
       {
        "raw": "50g di fesa di tacchino o di bresaola",
        "name": "Fesa di tacchino o di bresaola",
        "qty": 50,
        "unit": "g",
        "label": "50 g",
        "note": ""
       },
       {
        "raw": "150g di uva",
        "name": "Uva",
        "qty": 150,
        "unit": "g",
        "label": "150 g",
        "note": ""
       }
      ]
     },
     {
      "name": "Pranzo",
      "title": "Riso con uova e piselli",
      "items": [
       {
        "raw": "120g di riso",
        "name": "Riso",
        "qty": 120,
        "unit": "g",
        "label": "120 g",
        "note": ""
       },
       {
        "raw": "3 uova",
        "name": "Uova",
        "qty": 3,
        "unit": "pz",
        "label": "3 pz",
        "note": ""
       },
       {
        "raw": "100g di piselli surgelati",
        "name": "Piselli surgelati",
        "qty": 100,
        "unit": "g",
        "label": "100 g",
        "note": ""
       },
       {
        "raw": "2 cucchiaini di olio di oliva extra vergine",
        "name": "Olio di oliva extra vergine",
        "qty": 10,
        "unit": "ml",
        "label": "2 cucchiaini",
        "note": ""
       }
      ]
     },
     {
      "name": "Merenda",
      "title": "",
      "items": [
       {
        "raw": "125g di yogurt bianco magro sl (1 vasetto)",
        "name": "Yogurt bianco magro sl",
        "qty": 125,
        "unit": "g",
        "label": "125 g",
        "note": "1 vasetto"
       },
       {
        "raw": "1 banana",
        "name": "Banana",
        "qty": 1,
        "unit": "pz",
        "label": "1 pz",
        "note": ""
       },
       {
        "raw": "10g di cioccolato fondente",
        "name": "Cioccolato fondente",
        "qty": 10,
        "unit": "g",
        "label": "10 g",
        "note": ""
       }
      ]
     },
     {
      "name": "Cena",
      "title": "Petto di pollo con pane e verdure",
      "items": [
       {
        "raw": "150g di pane",
        "name": "Pane",
        "qty": 150,
        "unit": "g",
        "label": "150 g",
        "note": ""
       },
       {
        "raw": "200g di petto di pollo",
        "name": "Petto di pollo",
        "qty": 200,
        "unit": "g",
        "label": "200 g",
        "note": ""
       },
       {
        "raw": "150-200g di spinaci surgelati",
        "name": "Spinaci surgelati",
        "qty": 175,
        "unit": "g",
        "label": "150-200 g",
        "note": ""
       },
       {
        "raw": "2 cucchiaini di olio di oliva extra vergine",
        "name": "Olio di oliva extra vergine",
        "qty": 10,
        "unit": "ml",
        "label": "2 cucchiaini",
        "note": ""
       }
      ]
     }
    ]
   },
   {
    "n": 3,
    "meals": [
     {
      "name": "Colazione",
      "title": "Overnight porridge",
      "items": [
       {
        "raw": "40g di fiocchi d’avena",
        "name": "Fiocchi d’avena",
        "qty": 40,
        "unit": "g",
        "label": "40 g",
        "note": ""
       },
       {
        "raw": "150g di yogurt greco bianco 0% sl",
        "name": "Yogurt greco bianco 0% sl",
        "qty": 150,
        "unit": "g",
        "label": "150 g",
        "note": ""
       },
       {
        "raw": "4-5 cucchiai di latte parzialmente scremato sl o di soia senza zuccheri",
        "name": "Latte parzialmente scremato sl o di soia senza zuccheri",
        "qty": 45,
        "unit": "ml",
        "label": "4-5 cucchiai",
        "note": ""
       },
       {
        "raw": "10g di cioccolato",
        "name": "Cioccolato",
        "qty": 10,
        "unit": "g",
        "label": "10 g",
        "note": ""
       },
       {
        "raw": "1 banana",
        "name": "Banana",
        "qty": 1,
        "unit": "pz",
        "label": "1 pz",
        "note": ""
       }
      ]
     },
     {
      "name": "Spuntino",
      "title": "",
      "items": [
       {
        "raw": "4 crackers all'acqua Mulino Bianco o leggeri Eurospin",
        "name": "Crackers all'acqua Mulino Bianco o leggeri Eurospin",
        "qty": 4,
        "unit": "pz",
        "label": "4 pz",
        "note": ""
       },
       {
        "raw": "20g di grana",
        "name": "Grana",
        "qty": 20,
        "unit": "g",
        "label": "20 g",
        "note": ""
       },
       {
        "raw": "2 carote",
        "name": "Carote",
        "qty": 2,
        "unit": "pz",
        "label": "2 pz",
        "note": ""
       }
      ]
     },
     {
      "name": "Pranzo",
      "title": "Pasta con pasta di lenticchie al sugo di pomodoro e verdure",
      "items": [
       {
        "raw": "100g di pasta di lenticchie",
        "name": "Pasta di lenticchie",
        "qty": 100,
        "unit": "g",
        "label": "100 g",
        "note": ""
       },
       {
        "raw": "60g di pasta",
        "name": "Pasta",
        "qty": 60,
        "unit": "g",
        "label": "60 g",
        "note": ""
       },
       {
        "raw": "Passata di pomodoro",
        "name": "Passata di pomodoro",
        "qty": null,
        "unit": null,
        "label": "",
        "note": ""
       },
       {
        "raw": "150-200g di carote",
        "name": "Carote",
        "qty": 175,
        "unit": "g",
        "label": "150-200 g",
        "note": ""
       },
       {
        "raw": "2 cucchiaini di olio di oliva extra vergine",
        "name": "Olio di oliva extra vergine",
        "qty": 10,
        "unit": "ml",
        "label": "2 cucchiaini",
        "note": ""
       }
      ]
     },
     {
      "name": "Merenda",
      "title": "",
      "items": [
       {
        "raw": "125g di yogurt bianco magro sl",
        "name": "Yogurt bianco magro sl",
        "qty": 125,
        "unit": "g",
        "label": "125 g",
        "note": ""
       },
       {
        "raw": "20g di frutta secca",
        "name": "Frutta secca",
        "qty": 20,
        "unit": "g",
        "label": "20 g",
        "note": ""
       },
       {
        "raw": "1 galletta al cioccolato",
        "name": "Galletta al cioccolato",
        "qty": 1,
        "unit": "pz",
        "label": "1 pz",
        "note": ""
       }
      ]
     },
     {
      "name": "Cena",
      "title": "Pesce al forno con verdure",
      "items": [
       {
        "raw": "150g di pane",
        "name": "Pane",
        "qty": 150,
        "unit": "g",
        "label": "150 g",
        "note": ""
       },
       {
        "raw": "200g di salmone",
        "name": "Salmone",
        "qty": 200,
        "unit": "g",
        "label": "200 g",
        "note": ""
       },
       {
        "raw": "150-200g di pomodori",
        "name": "Pomodori",
        "qty": 175,
        "unit": "g",
        "label": "150-200 g",
        "note": ""
       },
       {
        "raw": "2 cucchiaini di olio di oliva extra vergine",
        "name": "Olio di oliva extra vergine",
        "qty": 10,
        "unit": "ml",
        "label": "2 cucchiaini",
        "note": ""
       }
      ]
     }
    ]
   },
   {
    "n": 4,
    "meals": [
     {
      "name": "Colazione",
      "title": "",
      "items": [
       {
        "raw": "150g di yogurt greco bianco 0% sl",
        "name": "Yogurt greco bianco 0% sl",
        "qty": 150,
        "unit": "g",
        "label": "150 g",
        "note": ""
       },
       {
        "raw": "70g di pane",
        "name": "Pane",
        "qty": 70,
        "unit": "g",
        "label": "70 g",
        "note": ""
       },
       {
        "raw": "20g di burro di arachidi 100% (2 cucchiaini)",
        "name": "Burro di arachidi 100%",
        "qty": 20,
        "unit": "g",
        "label": "20 g",
        "note": "2 cucchiaini"
       },
       {
        "raw": "20g di confettura (2 cucchiaini)",
        "name": "Confettura",
        "qty": 20,
        "unit": "g",
        "label": "20 g",
        "note": "2 cucchiaini"
       }
      ]
     },
     {
      "name": "Spuntino",
      "title": "",
      "items": [
       {
        "raw": "20g di cioccolato fondente",
        "name": "Cioccolato fondente",
        "qty": 20,
        "unit": "g",
        "label": "20 g",
        "note": ""
       },
       {
        "raw": "2 gallette di riso o mais",
        "name": "Gallette di riso o mais",
        "qty": 2,
        "unit": "pz",
        "label": "2 pz",
        "note": ""
       },
       {
        "raw": "1 banana",
        "name": "Banana",
        "qty": 1,
        "unit": "pz",
        "label": "1 pz",
        "note": ""
       }
      ]
     },
     {
      "name": "Pranzo",
      "title": "Piadina tacchino e provola con insalata",
      "items": [
       {
        "raw": "Piadina da 120g (senza strutto, con olio EVO)",
        "name": "Piadina",
        "qty": 120,
        "unit": "g",
        "label": "120 g",
        "note": "senza strutto, con olio EVO"
       },
       {
        "raw": "80g di fesa di tacchino o bresaola o prosciutto cotto",
        "name": "Fesa di tacchino o bresaola o prosciutto cotto",
        "qty": 80,
        "unit": "g",
        "label": "80 g",
        "note": ""
       },
       {
        "raw": "100g di mozzarella light",
        "name": "Mozzarella light",
        "qty": 100,
        "unit": "g",
        "label": "100 g",
        "note": ""
       },
       {
        "raw": "100-150g di insalata mista",
        "name": "Insalata mista",
        "qty": 125,
        "unit": "g",
        "label": "100-150 g",
        "note": ""
       },
       {
        "raw": "1 cucchiaino di olio di oliva extra vergine",
        "name": "Olio di oliva extra vergine",
        "qty": 5,
        "unit": "ml",
        "label": "1 cucchiaino",
        "note": ""
       }
      ]
     },
     {
      "name": "Merenda",
      "title": "",
      "items": [
       {
        "raw": "125g di yogurt bianco magro sl",
        "name": "Yogurt bianco magro sl",
        "qty": 125,
        "unit": "g",
        "label": "125 g",
        "note": ""
       },
       {
        "raw": "1 barretta cereali e cioccolato/cereali e frutti rossi o 1 galletta al ciocc.",
        "name": "Barretta cereali e cioccolato/cereali e frutti rossi o 1 galletta al ciocc",
        "qty": 1,
        "unit": "pz",
        "label": "1 pz",
        "note": ""
       },
       {
        "raw": "1 banana",
        "name": "Banana",
        "qty": 1,
        "unit": "pz",
        "label": "1 pz",
        "note": ""
       }
      ]
     },
     {
      "name": "Cena",
      "title": "Pasta con pasta di lenticchie al sugo di pomodoro e verdure",
      "items": [
       {
        "raw": "100g di pasta di lenticchie",
        "name": "Pasta di lenticchie",
        "qty": 100,
        "unit": "g",
        "label": "100 g",
        "note": ""
       },
       {
        "raw": "60g di pasta",
        "name": "Pasta",
        "qty": 60,
        "unit": "g",
        "label": "60 g",
        "note": ""
       },
       {
        "raw": "Passata di pomodoro",
        "name": "Passata di pomodoro",
        "qty": null,
        "unit": null,
        "label": "",
        "note": ""
       },
       {
        "raw": "150-200g di carote",
        "name": "Carote",
        "qty": 175,
        "unit": "g",
        "label": "150-200 g",
        "note": ""
       },
       {
        "raw": "2 cucchiaini di olio di oliva extra vergine",
        "name": "Olio di oliva extra vergine",
        "qty": 10,
        "unit": "ml",
        "label": "2 cucchiaini",
        "note": ""
       }
      ]
     }
    ]
   },
   {
    "n": 5,
    "meals": [
     {
      "name": "Colazione",
      "title": "",
      "items": [
       {
        "raw": "150g di yogurt greco bianco 0% sl",
        "name": "Yogurt greco bianco 0% sl",
        "qty": 150,
        "unit": "g",
        "label": "150 g",
        "note": ""
       },
       {
        "raw": "40g di riso soffiato",
        "name": "Riso soffiato",
        "qty": 40,
        "unit": "g",
        "label": "40 g",
        "note": ""
       },
       {
        "raw": "1 cucchiaino di miele",
        "name": "Miele",
        "qty": 5,
        "unit": "g",
        "label": "1 cucchiaino",
        "note": ""
       },
       {
        "raw": "20g di cioccolato fondente",
        "name": "Cioccolato fondente",
        "qty": 20,
        "unit": "g",
        "label": "20 g",
        "note": ""
       },
       {
        "raw": "1 pera",
        "name": "Pera",
        "qty": 1,
        "unit": "pz",
        "label": "1 pz",
        "note": ""
       }
      ]
     },
     {
      "name": "Spuntino",
      "title": "",
      "items": [
       {
        "raw": "125g di yogurt bianco magro sl",
        "name": "Yogurt bianco magro sl",
        "qty": 125,
        "unit": "g",
        "label": "125 g",
        "note": ""
       },
       {
        "raw": "2 gallette di riso con cioccolato",
        "name": "Gallette di riso con cioccolato",
        "qty": 2,
        "unit": "pz",
        "label": "2 pz",
        "note": ""
       },
       {
        "raw": "150g di uva",
        "name": "Uva",
        "qty": 150,
        "unit": "g",
        "label": "150 g",
        "note": ""
       }
      ]
     },
     {
      "name": "Pranzo",
      "title": "Riso con salmone e verdure",
      "items": [
       {
        "raw": "120g di riso",
        "name": "Riso",
        "qty": 120,
        "unit": "g",
        "label": "120 g",
        "note": ""
       },
       {
        "raw": "2 scatolette di tonno al naturale da 50g",
        "name": "Tonno al naturale",
        "qty": 100,
        "unit": "g",
        "label": "2 × 50 g",
        "note": ""
       },
       {
        "raw": "+ 1 uovo",
        "name": "Uovo",
        "qty": 1,
        "unit": "pz",
        "label": "1 pz",
        "note": ""
       },
       {
        "raw": "150-200g di carote",
        "name": "Carote",
        "qty": 175,
        "unit": "g",
        "label": "150-200 g",
        "note": ""
       },
       {
        "raw": "2 cucchiaini di olio di oliva extra vergine",
        "name": "Olio di oliva extra vergine",
        "qty": 10,
        "unit": "ml",
        "label": "2 cucchiaini",
        "note": ""
       }
      ]
     },
     {
      "name": "Merenda",
      "title": "",
      "items": [
       {
        "raw": "30g di crackers",
        "name": "Crackers",
        "qty": 30,
        "unit": "g",
        "label": "30 g",
        "note": ""
       },
       {
        "raw": "80g di formaggio cremoso spalmabile, light",
        "name": "Formaggio cremoso spalmabile, light",
        "qty": 80,
        "unit": "g",
        "label": "80 g",
        "note": ""
       },
       {
        "raw": "2 carote",
        "name": "Carote",
        "qty": 2,
        "unit": "pz",
        "label": "2 pz",
        "note": ""
       }
      ]
     },
     {
      "name": "Cena",
      "title": "Bruschette con ricotta e zucchine",
      "items": [
       {
        "raw": "150g di pane",
        "name": "Pane",
        "qty": 150,
        "unit": "g",
        "label": "150 g",
        "note": ""
       },
       {
        "raw": "100g di robiola",
        "name": "Robiola",
        "qty": 100,
        "unit": "g",
        "label": "100 g",
        "note": ""
       },
       {
        "raw": "1 galletta",
        "name": "Galletta",
        "qty": 1,
        "unit": "pz",
        "label": "1 pz",
        "note": ""
       },
       {
        "raw": "150-200g di zucchine",
        "name": "Zucchine",
        "qty": 175,
        "unit": "g",
        "label": "150-200 g",
        "note": ""
       },
       {
        "raw": "2 cucchiaini di olio di oliva extra vergine",
        "name": "Olio di oliva extra vergine",
        "qty": 10,
        "unit": "ml",
        "label": "2 cucchiaini",
        "note": ""
       }
      ]
     }
    ]
   },
   {
    "n": 6,
    "meals": [
     {
      "name": "Colazione",
      "title": "",
      "items": [
       {
        "raw": "150g di yogurt greco bianco 0% sl",
        "name": "Yogurt greco bianco 0% sl",
        "qty": 150,
        "unit": "g",
        "label": "150 g",
        "note": ""
       },
       {
        "raw": "70g di pane",
        "name": "Pane",
        "qty": 70,
        "unit": "g",
        "label": "70 g",
        "note": ""
       },
       {
        "raw": "20g di burro di arachidi 100% (2 cucchiaini)",
        "name": "Burro di arachidi 100%",
        "qty": 20,
        "unit": "g",
        "label": "20 g",
        "note": "2 cucchiaini"
       },
       {
        "raw": "20g di confettura (2 cucchiaini)",
        "name": "Confettura",
        "qty": 20,
        "unit": "g",
        "label": "20 g",
        "note": "2 cucchiaini"
       }
      ]
     },
     {
      "name": "Spuntino",
      "title": "",
      "items": [
       {
        "raw": "20g di grana",
        "name": "Grana",
        "qty": 20,
        "unit": "g",
        "label": "20 g",
        "note": ""
       },
       {
        "raw": "2 fette biscottate",
        "name": "Fette biscottate",
        "qty": 2,
        "unit": "pz",
        "label": "2 pz",
        "note": ""
       },
       {
        "raw": "1 mela",
        "name": "Mela",
        "qty": 1,
        "unit": "pz",
        "label": "1 pz",
        "note": ""
       }
      ]
     },
     {
      "name": "Pranzo",
      "title": "Riso zucchine e gamberetti",
      "items": [
       {
        "raw": "120g di riso",
        "name": "Riso",
        "qty": 120,
        "unit": "g",
        "label": "120 g",
        "note": ""
       },
       {
        "raw": "300g di gamberetti o calamari freschi o surgelati",
        "name": "Gamberetti o calamari freschi o surgelati",
        "qty": 300,
        "unit": "g",
        "label": "300 g",
        "note": ""
       },
       {
        "raw": "150-200g di zucchine",
        "name": "Zucchine",
        "qty": 175,
        "unit": "g",
        "label": "150-200 g",
        "note": ""
       },
       {
        "raw": "2 cucchiaini di olio di oliva extra vergine",
        "name": "Olio di oliva extra vergine",
        "qty": 10,
        "unit": "ml",
        "label": "2 cucchiaini",
        "note": ""
       }
      ]
     },
     {
      "name": "Merenda",
      "title": "Popcorn",
      "items": [
       {
        "raw": "60g di mais per popcorn",
        "name": "Mais per popcorn",
        "qty": 60,
        "unit": "g",
        "label": "60 g",
        "note": ""
       },
       {
        "raw": "2 cucchiaini di olio di oliva extra vergine",
        "name": "Olio di oliva extra vergine",
        "qty": 10,
        "unit": "ml",
        "label": "2 cucchiaini",
        "note": ""
       }
      ]
     },
     {
      "name": "Cena",
      "title": "Petto di tacchino con patate al forno e verdure",
      "items": [
       {
        "raw": "150g di pane",
        "name": "Pane",
        "qty": 150,
        "unit": "g",
        "label": "150 g",
        "note": ""
       },
       {
        "raw": "200g di petto di tacchino",
        "name": "Petto di tacchino",
        "qty": 200,
        "unit": "g",
        "label": "200 g",
        "note": ""
       },
       {
        "raw": "150-200g di spinaci",
        "name": "Spinaci",
        "qty": 175,
        "unit": "g",
        "label": "150-200 g",
        "note": ""
       },
       {
        "raw": "2 cucchiaini di olio di oliva extra vergine",
        "name": "Olio di oliva extra vergine",
        "qty": 10,
        "unit": "ml",
        "label": "2 cucchiaini",
        "note": ""
       }
      ]
     }
    ]
   },
   {
    "n": 7,
    "meals": [
     {
      "name": "Colazione",
      "title": "Pancakes",
      "items": [
       {
        "raw": "3-4 pancake piccoli.",
        "name": "Pancake piccoli",
        "qty": 3.5,
        "unit": "pz",
        "label": "3-4 pz",
        "note": ""
       },
       {
        "raw": "Conditi con: 20g di confettura (2 cucchiaini)",
        "name": "Confettura",
        "qty": 20,
        "unit": "g",
        "label": "20 g",
        "note": "2 cucchiaini"
       },
       {
        "raw": "125g di yogurt bianco magro sl",
        "name": "Yogurt bianco magro sl",
        "qty": 125,
        "unit": "g",
        "label": "125 g",
        "note": ""
       }
      ]
     },
     {
      "name": "Spuntino",
      "title": "",
      "items": [
       {
        "raw": "1 mela",
        "name": "Mela",
        "qty": 1,
        "unit": "pz",
        "label": "1 pz",
        "note": ""
       },
       {
        "raw": "10g di frutta secca (es. 5-6 mandorle, 1-2 noci, 5-6 anacardi ecc.)",
        "name": "Frutta secca",
        "qty": 10,
        "unit": "g",
        "label": "10 g",
        "note": "es. 5-6 mandorle, 1-2 noci, 5-6 anacardi ecc."
       }
      ]
     },
     {
      "name": "Pranzo",
      "title": "Frittata al forno con patate e verdure",
      "items": [
       {
        "raw": "150g di pane",
        "name": "Pane",
        "qty": 150,
        "unit": "g",
        "label": "150 g",
        "note": ""
       },
       {
        "raw": "3 uova",
        "name": "Uova",
        "qty": 3,
        "unit": "pz",
        "label": "3 pz",
        "note": ""
       },
       {
        "raw": "20g di grana",
        "name": "Grana",
        "qty": 20,
        "unit": "g",
        "label": "20 g",
        "note": ""
       },
       {
        "raw": "150-200g di spinaci",
        "name": "Spinaci",
        "qty": 175,
        "unit": "g",
        "label": "150-200 g",
        "note": ""
       },
       {
        "raw": "2 cucchiaini di olio di oliva extra vergine",
        "name": "Olio di oliva extra vergine",
        "qty": 10,
        "unit": "ml",
        "label": "2 cucchiaini",
        "note": ""
       }
      ]
     },
     {
      "name": "Merenda",
      "title": "",
      "items": [
       {
        "raw": "1 mela/ banana",
        "name": "Mela/ banana",
        "qty": 1,
        "unit": "pz",
        "label": "1 pz",
        "note": ""
       }
      ]
     },
     {
      "name": "Cena",
      "title": "Pasto a scelta",
      "items": [
       {
        "raw": "A scelta",
        "name": "A scelta",
        "qty": null,
        "unit": null,
        "label": "",
        "note": ""
       }
      ]
     }
    ]
   }
  ],
  "notes": [
   {
    "title": "Indicazioni",
    "lines": [
     "Le tipologie di frutta e verdura sono indicative, si possono sostituire con quelle di stagione presenti in tabella mantenendo la stessa quantità inserita nel piano.",
     "Per la frutta, considera circa 150-200g (es. 2 kiwi, 2 prugne, 1 pera, 1 banana ecc.).",
     "Se non riesci a mangiarla a colazione o nello spuntino, puoi mangiarla dopo pranzo o dopo cena.",
     "Per la verdura, considerane 150-200g. Per l’insalata considerane 100g circa.",
     "Frutta di Stagione (giugno-luglio) — Verdura di Stagione (giugno-luglio)",
     "Mele, albicocche, fragole, pesche, melone, lamponi, mirtilli, anguria, nespole, banane, uva, fichi, mango — Asparagi, bietole, lattuga, porri, puntarelle, rucola, spinaci, valeriana (songino), carote, sedano, sedano rapa, cipolle, cipollotti, finocchi, zucchine, pomodori, melanzane, peperoni",
     "I giorni possono essere invertiti e i pasti, all’interno della giornata, sono interscambiabili",
     "Il peso degli alimenti si intende a crudo",
     "È previsto un pasto a scelta a settimana",
     "I 2 cucchiaini d’olio extravergine d’oliva ad ogni pasto possono essere utilizzati o per condire a crudo o per cuocere gli alimenti (Es. zucchine con soffritto di olio e aglio).",
     "Se utilizzi i legumi in scatola o già cotti, triplica la quantità dei legumi secchi. Es: 100g di ceci secchi = 300g di ceci in scatola, scolati e sciacquati.",
     "Puoi aggiungere spezie, passata di pomodoro, cipolla e aglio ad ogni pietanza",
     "Riso, pasta, farro, orzo, quinoa e couscous sono interscambiali tra loro, nelle stesse quantità. Consiglio di variare la scelta durante la settimana",
     "150g di pane possono essere sostituiti con 500 gr di patate o con 250g di gnocchi o con 120g di riso/pasta/farro/couscous e viceversa. Consiglio di variare la scelta durante la settimana",
     "Riso soffiato, fiocchi d’avena e cornflakes sono interscambiali tra loro nelle stesse quantità",
     "Puoi utilizzare qualche goccia di Diete.Tic per dolcificare lo yogurt",
     "La frutta secca e il burro di frutta secca sono interscambiali nelle stesse quantità. Es. 10g di arachidi corrispondono a 10g di burro di arachidi 100% (1 cucchiaino)"
    ]
   },
   {
    "title": "Consigli",
    "lines": [
     "Evita bevande zuccherate (es. succhi di frutta, anche quelli senza zuccheri aggiunti) e/o gassate, ti consiglio le bevande 0 zuccheri saltuariamente (1-2 volte a settimana)",
     "Evita il consumo di vino, birra ed in generale di bevande alcoliche",
     "Bevi almeno 2 litri di acqua al giorno",
     "Bevi al massimo 3 caffè al giorno, evita di zuccherarli, se non riesci, utilizza il dolcificante",
     "Utilizza succo di limone, aceto, spezie ed erbe aromatiche nella preparazione dei piatti in modo tale da ridurre la quantità di sale",
     "Mastica lentamente ed evita fonti di distrazione come cellulare e tv",
     "Evita di saltare i pasti",
     "Mangia ad orari regolari",
     "Evita di fare compensazioni: se non rispetti un pasto, riprendi normalmente il piano al pasto successivo senza eliminare le fonti di carboidrati e senza ridurre le quantità degli alimenti",
     "Varia le tipologie di frutta e verdura durante la settimana",
     "Cotture consigliate: a vapore, alla griglia, al microonde, al forno, in padella, in friggitrice ad aria"
    ]
   },
   {
    "title": "Consigli dispepsia",
    "lines": [
     "Mastica lentamente evitando fonti di distrazione (cellulare, tv ecc.)",
     "Cerca di fare 5 pasti evitando così di fare pasti abbondanti",
     "Dopo pranzo o dopo cena evita di distenderti per almeno un’ora",
     "Non bere durante i pasti",
     "Non bere subito prima di andare a dormire",
     "Non utilizzare pantaloni stretti in vita",
     "Fai del movimento durante la giornata",
     "Alimenti da ridurre\\evitare:",
     "Caffè e tè che contengono caffeina.",
     "Alcolici di qualsiasi genere",
     "Bevande gasate",
     "Cibi eccessivamente speziati e piccanti (pepe, menta, peperoncino e salse derivate)",
     "Succhi di frutta",
     "Alimenti fritti",
     "Latticini più grassi (panna, burro, mascarpone, besciamella)",
     "Alimenti eccessivamente anneriti e bruciati dalla cottura",
     "Cibi troppo caldi o troppo freddi",
     "Sughi già pronti eccessivamente ricchi in grassi e sale",
     "Pomodoro, peperoni, cipolla, arance, in generale alimenti acidi (da valutare la tollerabilità)"
    ]
   },
   {
    "title": "Integrazione consigliata",
    "lines": [
     "DUENZIMA: 2 cps prima di un pasto principale particolarmente abbondante.",
     "Se non dovessi trovare il Duenzima, puoi prendere il Metadigest Total o Enzyformula."
    ]
   }
  ]
 },
 "planName": "dieta x app.docx",
 "shop": [
  {
   "name": "Mele",
   "qty": 4,
   "unit": "pz",
   "note": "",
   "cat": "frutta",
   "checked": false
  },
  {
   "name": "Pere",
   "qty": 2,
   "unit": "pz",
   "note": "",
   "cat": "frutta",
   "checked": false
  },
  {
   "name": "Banane",
   "qty": 4,
   "unit": "pz",
   "note": "",
   "cat": "frutta",
   "checked": false
  },
  {
   "name": "Uva",
   "qty": 300,
   "unit": "g",
   "note": "",
   "cat": "frutta",
   "checked": false
  },
  {
   "name": "Pomodori",
   "qty": 350,
   "unit": "g",
   "note": "",
   "cat": "verdure",
   "checked": false
  },
  {
   "name": "Zucchine",
   "qty": 525,
   "unit": "g",
   "note": "",
   "cat": "verdure",
   "checked": false
  },
  {
   "name": "Carote",
   "qty": 750,
   "unit": "g",
   "note": "1 busta da 750g-1kg",
   "cat": "verdure",
   "checked": false
  },
  {
   "name": "Spinaci (freschi o surgelati)",
   "qty": 525,
   "unit": "g",
   "note": "1 busta surgelata da 450g + 1 busta fresca da 100-150g",
   "cat": "verdure",
   "checked": false
  },
  {
   "name": "Insalata mista",
   "qty": 125,
   "unit": "g",
   "note": "1 busta da 125-150g",
   "cat": "verdure",
   "checked": false
  },
  {
   "name": "Yogurt greco bianco 0% s.l.",
   "qty": 750,
   "unit": "g",
   "note": "5 vasetti da 150g",
   "cat": "latticini",
   "checked": false
  },
  {
   "name": "Yogurt bianco magro s.l.",
   "qty": 625,
   "unit": "g",
   "note": "5 vasetti da 125g",
   "cat": "latticini",
   "checked": false
  },
  {
   "name": "Formaggio cremoso spalmabile light",
   "qty": 160,
   "unit": "g",
   "note": "1 vaschetta da 175-200g",
   "cat": "latticini",
   "checked": false
  },
  {
   "name": "Robiola",
   "qty": 100,
   "unit": "g",
   "note": "1 confezione piccola",
   "cat": "latticini",
   "checked": false
  },
  {
   "name": "Mozzarella light",
   "qty": 338,
   "unit": "g",
   "note": "3 mozzarelle da 100-125g",
   "cat": "latticini",
   "checked": false
  },
  {
   "name": "Grana grattugiato",
   "qty": 85,
   "unit": "g",
   "note": "1 confezione piccola da 100g",
   "cat": "latticini",
   "checked": false
  },
  {
   "name": "Uova",
   "qty": 7,
   "unit": "pz",
   "note": "1 confezione da 10 (o 2 da 6)",
   "cat": "proteine",
   "checked": false
  },
  {
   "name": "Burro di arachidi 100%",
   "qty": 40,
   "unit": "g",
   "note": "1 vasetto",
   "cat": "varie",
   "checked": false
  },
  {
   "name": "Latte parzialmente scremato s.l. (o soia senza zuccheri)",
   "qty": 70,
   "unit": "ml",
   "note": "usa la scorta di casa",
   "cat": "latticini",
   "checked": false
  },
  {
   "name": "Carne magra di vitello",
   "qty": 200,
   "unit": "g",
   "note": "",
   "cat": "proteine",
   "checked": false
  },
  {
   "name": "Petto di pollo",
   "qty": 200,
   "unit": "g",
   "note": "",
   "cat": "proteine",
   "checked": false
  },
  {
   "name": "Petto di tacchino",
   "qty": 200,
   "unit": "g",
   "note": "",
   "cat": "proteine",
   "checked": false
  },
  {
   "name": "Fesa di tacchino o bresaola (spuntino + piadina)",
   "qty": 130,
   "unit": "g",
   "note": "150g dal banco salumi",
   "cat": "proteine",
   "checked": false
  },
  {
   "name": "Salmone fresco",
   "qty": 200,
   "unit": "g",
   "note": "",
   "cat": "proteine",
   "checked": false
  },
  {
   "name": "Tonno al naturale",
   "qty": 100,
   "unit": "g",
   "note": "2 scatolette da 50g",
   "cat": "proteine",
   "checked": false
  },
  {
   "name": "Gamberetti o calamari (freschi/surgelati)",
   "qty": 300,
   "unit": "g",
   "note": "",
   "cat": "proteine",
   "checked": false
  },
  {
   "name": "Pane fresco",
   "qty": 1310,
   "unit": "g",
   "note": "acquisti frazionati durante la settimana",
   "cat": "carbo",
   "checked": false
  },
  {
   "name": "Piadina (senza strutto, con olio EVO)",
   "qty": 1,
   "unit": "pz",
   "note": "",
   "cat": "carbo",
   "checked": false
  },
  {
   "name": "Pancake già pronti",
   "qty": 4,
   "unit": "pz",
   "note": "1 confezione",
   "cat": "carbo",
   "checked": false
  },
  {
   "name": "Riso",
   "qty": 360,
   "unit": "g",
   "note": "1 confezione da 500g",
   "cat": "carbo",
   "checked": false
  },
  {
   "name": "Pasta",
   "qty": 120,
   "unit": "g",
   "note": "1 confezione da 500g",
   "cat": "carbo",
   "checked": false
  },
  {
   "name": "Pasta di lenticchie",
   "qty": 200,
   "unit": "g",
   "note": "1 confezione da 250g",
   "cat": "carbo",
   "checked": false
  },
  {
   "name": "Fiocchi d'avena",
   "qty": 40,
   "unit": "g",
   "note": "1 confezione piccola",
   "cat": "carbo",
   "checked": false
  },
  {
   "name": "Riso soffiato",
   "qty": 40,
   "unit": "g",
   "note": "1 confezione piccola",
   "cat": "carbo",
   "checked": false
  },
  {
   "name": "Mais per popcorn",
   "qty": 60,
   "unit": "g",
   "note": "1 confezione",
   "cat": "carbo",
   "checked": false
  },
  {
   "name": "Passata di pomodoro",
   "qty": 400,
   "unit": "g",
   "note": "1 bottiglia da 500-700g",
   "cat": "varie",
   "checked": false
  },
  {
   "name": "Patè di olive nere",
   "qty": 25,
   "unit": "g",
   "note": "1 vasetto piccolo",
   "cat": "varie",
   "checked": false
  },
  {
   "name": "Piselli surgelati",
   "qty": 100,
   "unit": "g",
   "note": "1 busta piccola",
   "cat": "verdure",
   "checked": false
  },
  {
   "name": "Olio extravergine di oliva",
   "qty": 125,
   "unit": "ml",
   "note": "",
   "cat": "varie",
   "checked": false
  },
  {
   "name": "Miele",
   "qty": 30,
   "unit": "g",
   "note": "1 vasetto",
   "cat": "varie",
   "checked": false
  },
  {
   "name": "Frutta secca mista (mandorle, noci, anacardi)",
   "qty": 75,
   "unit": "g",
   "note": "1 confezione da 100g",
   "cat": "varie",
   "checked": false
  },
  {
   "name": "Cioccolato fondente",
   "qty": 60,
   "unit": "g",
   "note": "1 tavoletta",
   "cat": "varie",
   "checked": false
  },
  {
   "name": "Biscotti",
   "qty": 40,
   "unit": "g",
   "note": "1 confezione",
   "cat": "carbo",
   "checked": false
  },
  {
   "name": "Confettura",
   "qty": 60,
   "unit": "g",
   "note": "1 vasetto",
   "cat": "varie",
   "checked": false
  },
  {
   "name": "Crackers",
   "qty": 60,
   "unit": "g",
   "note": "1 pacchetto (2 da 30g)",
   "cat": "carbo",
   "checked": false
  },
  {
   "name": "Crackers all'acqua (Mulino Bianco o leggeri Eurospin)",
   "qty": 4,
   "unit": "pz",
   "note": "1 confezione",
   "cat": "carbo",
   "checked": false
  },
  {
   "name": "Fette biscottate",
   "qty": 2,
   "unit": "pz",
   "note": "1 confezione",
   "cat": "carbo",
   "checked": false
  },
  {
   "name": "Gallette di riso o mais",
   "qty": 3,
   "unit": "pz",
   "note": "1 confezione",
   "cat": "carbo",
   "checked": false
  },
  {
   "name": "Gallette di riso al cioccolato",
   "qty": 2,
   "unit": "pz",
   "note": "1 confezione",
   "cat": "carbo",
   "checked": false
  },
  {
   "name": "Galletta al cioccolato",
   "qty": 1,
   "unit": "pz",
   "note": "",
   "cat": "carbo",
   "checked": false
  },
  {
   "name": "Barretta cereali e cioccolato o frutti rossi",
   "qty": 1,
   "unit": "pz",
   "note": "",
   "cat": "varie",
   "checked": false
  }
 ],
 "shopName": "Lista della Spesa x app.docx"
};
