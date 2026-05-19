import React, { useState, useEffect, useRef, useMemo } from "react";

/* ==================================================================
   ECE FLEMME — Plateforme de révision ING1 · ECE Paris
   Informatique · Mathématiques · Mécanique · Électronique
   ================================================================== */

const T = {
  bg: "#0f1117", bg2: "#171a23", bg3: "#1f232f", bg4: "#272c3a",
  line: "#2e3340", txt: "#e8e9ee", dim: "#9aa0b0", faint: "#646b7e",
  amber: "#f0a23c", cyan: "#46c8d4", green: "#5fcf8e", coral: "#ec6a5e",
  violet: "#a78bfa", blue: "#5b9df0", pink: "#f06fae", yellow: "#e8c84a",
};

const SUBJECTS = [
  { id: "info", name: "Informatique", short: "Algo & C", color: T.cyan, glyph: "{ }",
    tagline: "Langage C, pointeurs, structures, piles, files, listes, récursivité, fichiers, Allegro." },
  { id: "math", name: "Mathématiques", short: "Analyse & Algèbre", color: T.violet, glyph: "∫",
    tagline: "Développements limités, intégrales généralisées, matrices, déterminants." },
  { id: "meca", name: "Mécanique", short: "Point & Oscillations", color: T.amber, glyph: "↻",
    tagline: "Travail, puissance, énergie, oscillateurs harmoniques amortis et forcés." },
  { id: "elec", name: "Électronique", short: "Circuits & Filtres", color: T.green, glyph: "⏚",
    tagline: "Lois des circuits, diviseur de tension, régime sinusoïdal, filtres, AOP, méthode TP." },
];

/* ================== FICHES — INFORMATIQUE ================== */

const FICHES_INFO = [
  {
    id: "i-base", subject: "info", title: "Rappels langage C", sub: "variables · types · boucles · fonctions",
    blurb: "Les fondations à maîtriser avant tout : types, opérateurs, conditions, boucles, fonctions.",
    sections: [
      { title: "Types et déclarations", blocks: [
        { t: "p", v: "Une variable a un type qui fixe sa taille mémoire et les opérations possibles." },
        { t: "table", head: ["Type", "Contenu", "Format"], rows: [
          ["int", "Entier", "%d"],
          ["float / double", "Réel", "%f / %lf"],
          ["char", "Un caractère", "%c"],
          ["char[ ]", "Chaîne de caractères", "%s"],
        ]},
        { t: "code", v: `int   age = 20;
float moyenne = 14.5;
char  initiale = 'M';
char  nom[20] = "Dupont";` },
      ]},
      { title: "Conditions et boucles", blocks: [
        { t: "code", v: `if (n > 0) { ... }
else if (n == 0) { ... }
else { ... }

for (int i = 0; i < n; i++) { ... }   // nb de tours connu
while (condition) { ... }             // tant que vrai
do { ... } while (condition);         // au moins 1 tour` },
        { t: "note", kind: "warn", title: "Piège classique",
          v: "= est une AFFECTATION, == est une COMPARAISON. if (x = 0) affecte 0 à x au lieu de tester." },
      ]},
      { title: "Fonctions", blocks: [
        { t: "p", v: "Une fonction a un prototype : un type de retour, un nom, des paramètres typés." },
        { t: "code", v: `int maximum(int a, int b) {   // retourne un int
    if (a > b) return a;
    return b;
}
int m = maximum(3, 7);   // appel : m vaut 7` },
        { t: "note", kind: "tip", title: "Passage par valeur",
          v: "Les paramètres sont COPIÉS. Pour modifier une variable de l'appelant, il faut passer son adresse (voir fiche Pointeurs)." },
      ]},
      { title: "Entrées / sorties", blocks: [
        { t: "code", v: `printf("Resultat = %d\\n", n);     // afficher
scanf("%d", &n);                  // lire un entier
fgets(buffer, sizeof(buffer), stdin);  // lire une ligne` },
        { t: "note", kind: "warn", title: "Le & de scanf",
          v: "scanf doit ÉCRIRE dans la variable : on lui passe son adresse avec &. Oublier le & est l'erreur n°1." },
      ]},
    ],
  },
  {
    id: "i-ptr", subject: "info", title: "Pointeurs & mémoire", sub: "adresses · & · * · void*",
    blurb: "Une variable qui contient l'adresse d'une autre. La base de tout : tableaux, structures, listes.",
    sections: [
      { title: "Adresse, & et *", blocks: [
        { t: "p", v: "Chaque variable occupe une case mémoire repérée par une adresse. Un pointeur est une variable dont la valeur EST une adresse." },
        { t: "list", v: [
          "&x → l'opérateur & donne l'adresse de la variable x.",
          "*p → l'opérateur * (indirection) donne la valeur stockée à l'adresse p.",
          "int *p; → déclare p, un pointeur sur un entier.",
        ]},
        { t: "code", v: `int x = 5;
int *p = &x;        // p contient l'adresse de x
printf("%d", *p);   // affiche 5
*p = 9;             // modifie x via p -> x vaut 9` },
        { t: "note", kind: "tip", title: "Lire une déclaration",
          v: "int *p se lit « *p est un int » : p est donc un pointeur sur int. & et * sont inverses : *(&x) vaut x." },
      ]},
      { title: "Le pointeur NULL", blocks: [
        { t: "p", v: "NULL est une adresse spéciale qui signifie « ne pointe vers rien ». Un pointeur qui peut échouer (malloc, fopen) doit toujours être testé contre NULL." },
        { t: "code", v: `int *p = malloc(sizeof(int));
if (p == NULL) { printf("Echec\\n"); return 1; }
*p = 10;` },
        { t: "note", kind: "warn", title: "Pointeur non initialisé",
          v: "int *p; puis *p = 5; sans adresse valide → comportement indéfini (crash). Toujours initialiser." },
      ]},
      { title: "Passage par adresse", blocks: [
        { t: "p", v: "En C les paramètres sont passés par VALEUR (copie). Pour qu'une fonction modifie une variable de l'appelant, on lui passe son ADRESSE." },
        { t: "code", v: `void echange(int *a, int *b) {
    int tmp = *a; *a = *b; *b = tmp;
}
echange(&x, &y);   // on passe les ADRESSES` },
        { t: "p", v: "C'est pour ça que scanf(\"%d\", &n) prend &n : scanf doit écrire DANS n." },
      ]},
      { title: "Pointeurs et tableaux", blocks: [
        { t: "p", v: "Le nom d'un tableau est l'adresse de sa première case. tab et &tab[0] désignent la même chose." },
        { t: "list", v: [
          "tab[i] est équivalent à *(tab + i).",
          "Arithmétique : p+1 avance d'UN élément (l'unité = la taille du type pointé).",
          "Un tableau passé à une fonction « devient » un pointeur (l'adresse, pas une copie).",
        ]},
        { t: "code", v: `int tab[4] = {10, 20, 30, 40};
int *p = tab;
printf("%d", *(p+2));   // affiche 30
p++;                    // p pointe sur tab[1]` },
      ]},
      { title: "Pointeurs génériques void*", blocks: [
        { t: "p", v: "Un void* pointe sur n'importe quel type. Il sert aux librairies GÉNÉRIQUES (file, pile) valables quel que soit le type des données." },
        { t: "code", v: `void *data = defiler(&file);
t_patient *p = (t_patient*) data;   // cast obligatoire
printf("%s", p->nom);` },
        { t: "note", kind: "warn", title: "Piège",
          v: "On ne peut pas faire *p sur un void* sans caster : le programme ignore combien d'octets lire." },
      ]},
      { title: "Pièges sur les pointeurs", blocks: [
        { t: "table", head: ["Erreur", "Conséquence"], rows: [
          ["Pointeur non initialisé déréférencé", "Crash / comportement indéfini"],
          ["Oublier le & dans scanf", "Écriture sur adresse invalide"],
          ["Retourner l'adresse d'une variable locale", "Dangling pointer"],
          ["Utiliser *p après free(p)", "Accès zone libérée"],
        ]},
      ]},
      { title: "Exemple guidé — échanger deux entiers", blocks: [
        { t: "p", v: "Une fonction qui modifie les variables de l'appelant doit recevoir leurs adresses." },
        { t: "code", v: `void echange(int *a, int *b) {
    int t = *a;
    *a = *b;
    *b = t;
}
// appel :  echange(&x, &y);` },
        { t: "list", v: [
          "int *a, int *b : la fonction reçoit des ADRESSES, pas des copies.",
          "int t = *a; : on lit la valeur à l'adresse a et on la sauvegarde.",
          "*a = *b; : on écrit dans la case pointée par a la valeur pointée par b.",
          "*b = t; : on remet l'ancienne valeur de a dans la case de b.",
          "echange(&x, &y); : on passe les adresses avec l'opérateur &.",
        ]},
        { t: "note", kind: "warn", title: "Piège fréquent",
          v: "Sans les étoiles (echange(int a, int b)), la fonction travaille sur des copies : les variables de l'appelant ne changent pas." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "On a : int x = 4; int *p = &x; *p = *p + 6; Que vaut x ensuite ?" },
        { t: "note", kind: "tip", title: "Correction",
          v: "x vaut 10. *p désigne la case de x : modifier *p modifie directement x." },
      ]},
    ],
  },
  {
    id: "i-tab", subject: "info", title: "Tableaux", sub: "statiques · dynamiques · 2D",
    blurb: "Regrouper plusieurs valeurs du même type. Statiques sur la pile, dynamiques sur le tas.",
    sections: [
      { title: "Tableau statique", blocks: [
        { t: "p", v: "Un tableau statique a une taille FIXE connue à la compilation. Les indices vont de 0 à taille−1." },
        { t: "code", v: `int notes[5] = {12, 8, 15, 17, 9};
notes[0] = 14;            // premier element
for (int i = 0; i < 5; i++)
    printf("%d ", notes[i]);` },
        { t: "note", kind: "warn", title: "Dépassement",
          v: "Boucler avec i <= 5 accède à notes[5] qui n'existe pas (indices 0 à 4) → comportement indéfini." },
      ]},
      { title: "Tableau dynamique 1D", blocks: [
        { t: "p", v: "Quand la taille n'est connue qu'à l'exécution, on alloue avec malloc." },
        { t: "code", v: `int n;
scanf("%d", &n);
int *tab = malloc(n * sizeof(int));
if (tab == NULL) return 1;
... // tab[i] comme un tableau normal
free(tab);` },
      ]},
      { title: "Tableau dynamique 2D", blocks: [
        { t: "p", v: "Un tableau 2D dynamique = un tableau de pointeurs (les lignes), puis chaque ligne. Libération dans l'ordre INVERSE." },
        { t: "code", v: `int **mat = malloc(lignes * sizeof(int*));
for (int i = 0; i < lignes; i++)
    mat[i] = malloc(colonnes * sizeof(int));
// utilisation : mat[i][j]
for (int i = 0; i < lignes; i++) free(mat[i]);
free(mat);` },
        { t: "note", kind: "tip", title: "Ordre de libération",
          v: "On libère d'abord chaque ligne, PUIS le tableau de pointeurs. L'inverse perd les adresses des lignes." },
      ]},
    ],
  },
  {
    id: "i-alloc", subject: "info", title: "Allocation dynamique", sub: "malloc · calloc · realloc · free",
    blurb: "Demander et libérer de la mémoire pendant l'exécution. Le passage de la pile au tas.",
    sections: [
      { title: "Pile (stack) vs Tas (heap)", blocks: [
        { t: "table", head: ["", "Pile", "Tas"], rows: [
          ["Gestion", "Automatique (compilateur)", "Manuelle (malloc/free)"],
          ["Durée de vie", "Limitée à la fonction", "Choisie par le programmeur"],
          ["Création", "Entrée d'une fonction", "malloc / calloc / realloc"],
          ["Risque", "Dépassement de pile", "Fuites, accès invalides"],
        ]},
        { t: "code", v: `int* mauvais() {
    int x = 42;
    return &x;   // ERREUR : x detruit a la sortie
}
int* bon() {
    int *p = malloc(sizeof(int));
    *p = 42;
    return p;    // OK : vit dans le tas
}` },
        { t: "note", kind: "tip", title: "Image mentale",
          v: "La pile = un bureau temporaire (rapide, limité). Le tas = un entrepôt (vaste, mais il faut ranger soi-même)." },
      ]},
      { title: "L'opérateur sizeof", blocks: [
        { t: "p", v: "La taille d'un type dépend de la machine : on ne la devine jamais, on la demande avec sizeof." },
        { t: "code", v: `int   *p   = malloc(sizeof(int));
float *tab = malloc(10 * sizeof(float));
int   *q   = malloc(sizeof(*q));   // s'adapte au type de q` },
      ]},
      { title: "malloc, calloc, realloc, free", blocks: [
        { t: "table", head: ["Fonction", "Rôle", "Initialise ?"], rows: [
          ["malloc(taille)", "Allouer un bloc", "Non (valeurs aléatoires)"],
          ["calloc(nb, taille)", "Allouer + mettre à zéro", "Oui (zéro)"],
          ["realloc(ptr, taille)", "Redimensionner un bloc", "Préserve l'existant"],
          ["free(ptr)", "Libérer un bloc", "—"],
        ]},
        { t: "p", v: "Toutes retournent un void*. malloc/calloc retournent NULL si échec : il faut TOUJOURS le tester." },
        { t: "code", v: `int n;  scanf("%d", &n);
int *tab = malloc(n * sizeof(int));
if (tab == NULL) { printf("Echec\\n"); return 1; }
... // tab[i]
free(tab);` },
        { t: "p", v: "realloc peut déplacer le bloc : récupérer TOUJOURS le retour dans une variable temporaire." },
        { t: "code", v: `int *tmp = realloc(tab, 5 * sizeof(int));
if (tmp == NULL) { free(tab); return 1; }
tab = tmp;` },
      ]},
      { title: "Chaîne dynamique — le schéma clé", blocks: [
        { t: "p", v: "Pour dimensionner exactement une chaîne saisie : lire dans un buffer, allouer strlen+1, recopier." },
        { t: "code", v: `char buffer[100];
fgets(buffer, sizeof(buffer), stdin);
buffer[strcspn(buffer, "\\n")] = '\\0';      // retire le \\n
char *nom = malloc(strlen(buffer) + 1);    // +1 pour le \\0
if (nom != NULL) strcpy(nom, buffer);` },
      ]},
      { title: "Règle d'or & erreurs", blocks: [
        { t: "note", kind: "tip", title: "Règle d'or", v: "1 malloc = 1 free. Pour une struct à champ dynamique : libérer le champ AVANT la struct." },
        { t: "table", head: ["Erreur", "Conséquence"], rows: [
          ["Oublier free()", "Fuite mémoire"],
          ["Libérer deux fois", "Comportement imprévisible"],
          ["Utiliser après free()", "Crash"],
          ["Écraser le pointeur avant free()", "Fuite permanente"],
        ]},
      ]},
      { title: "Exemple guidé — tableau dynamique", blocks: [
        { t: "p", v: "Allouer, remplir puis libérer un tableau dont la taille n'est connue qu'à l'exécution." },
        { t: "code", v: `int n;
scanf("%d", &n);
int *tab = malloc(n * sizeof(int));
if (tab == NULL) return 1;
for (int i = 0; i < n; i++)
    tab[i] = i * i;
free(tab);` },
        { t: "list", v: [
          "scanf(\"%d\", &n); : la taille n est saisie à l'exécution.",
          "malloc(n * sizeof(int)) : on réserve un bloc pour n entiers.",
          "if (tab == NULL) : on vérifie que l'allocation a réussi.",
          "tab[i] = i * i; : on remplit le tableau comme un tableau normal.",
          "free(tab); : on rend le bloc au système — obligatoire.",
        ]},
        { t: "note", kind: "warn", title: "Piège fréquent",
          v: "Oublier free → fuite mémoire. Oublier le test NULL → plantage si la mémoire manque." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "Ce code a deux défauts : int *t = malloc(n*sizeof(int)); for(...) t[i]=0; Lesquels ?" },
        { t: "note", kind: "tip", title: "Correction",
          v: "1) Pas de test if (t == NULL). 2) Pas de free(t) à la fin : fuite mémoire." },
      ]},
    ],
  },
  {
    id: "i-struct", subject: "info", title: "Structures", sub: "typedef struct · .  et  ->",
    blurb: "Regrouper plusieurs informations de types différents dans un type personnalisé.",
    sections: [
      { title: "Définir un type structuré", blocks: [
        { t: "code", v: `typedef struct {
    char nom[20];
    int  age;
    float moyenne;
} t_etudiant;

t_etudiant e;` },
        { t: "note", kind: "tip", title: "Convention",
          v: "Préfixe t_ pour un type structuré : t_patient, t_voiture, t_livre. C'est la convention du cours." },
      ]},
      { title: "Accéder aux champs : . et ->", blocks: [
        { t: "table", head: ["On a…", "Opérateur", "Exemple"], rows: [
          ["Une variable struct", ".  (point)", "e.age = 20;"],
          ["Un POINTEUR sur struct", "->  (flèche)", "p->age = 20;"],
        ]},
        { t: "code", v: `t_etudiant e;
e.age = 20;             // variable -> point
t_etudiant *p = &e;
p->age = 21;            // pointeur -> fleche
(*p).age = 21;          // strictement equivalent` },
      ]},
      { title: "Tableaux et structures imbriquées", blocks: [
        { t: "code", v: `t_etudiant *promo = malloc(n * sizeof(t_etudiant));
promo[0].age = 18;

typedef struct { int jour, mois, annee; } t_date;
typedef struct {
    char nom[20];
    t_date naissance;     // structure imbriquee
} t_personne;
t_personne p;
p.naissance.annee = 2005;` },
      ]},
      { title: "Passer une structure en paramètre", blocks: [
        { t: "p", v: "On passe (presque) toujours une structure PAR ADRESSE : plus efficace (pas de copie) et modifiable." },
        { t: "code", v: `void init(t_etudiant *e) { e->age = 0; }
init(&promo[0]);` },
        { t: "note", kind: "warn", title: "Piège",
          v: "Passer une struct sans & en fait une copie : les modifications sont perdues à la sortie." },
      ]},
      { title: "Structure avec champ dynamique", blocks: [
        { t: "p", v: "Quand un champ est un pointeur, il faut l'allouer après la struct et le libérer AVANT la struct." },
        { t: "code", v: `typedef struct { char *nom; int priorite; } t_patient;

t_patient *p = malloc(sizeof(t_patient)); // 1. la struct
p->nom = malloc(strlen(buf) + 1);         // 2. le champ
strcpy(p->nom, buf);
...
free(p->nom);   // 3. d'abord le champ
free(p);        // 4. puis la struct` },
        { t: "note", kind: "warn", title: "Ordre de libération",
          v: "free(p) avant free(p->nom) → on perd l'adresse du nom → fuite mémoire irrattrapable." },
      ]},
      { title: "Exemple guidé — structure à champ dynamique", blocks: [
        { t: "p", v: "Une structure peut contenir un champ alloué dynamiquement (ici, le nom)." },
        { t: "code", v: `typedef struct {
    char *nom;
    int   age;
} t_personne;

t_personne *p = malloc(sizeof(t_personne));
p->nom = malloc(20 * sizeof(char));
strcpy(p->nom, "Meric");
p->age = 19;
free(p->nom);
free(p);` },
        { t: "list", v: [
          "malloc(sizeof(t_personne)) : on alloue la structure elle-même.",
          "p->nom = malloc(...) : on alloue séparément le champ dynamique.",
          "p->nom équivaut à (*p).nom : la flèche car p est un pointeur.",
          "free(p->nom) PUIS free(p) : le champ d'abord, la structure ensuite.",
        ]},
        { t: "note", kind: "warn", title: "Piège fréquent",
          v: "free(p) avant free(p->nom) : on perd l'adresse du nom → fuite mémoire irrattrapable." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "On a un pointeur p sur une structure t_personne. Comment lire son champ age ?" },
        { t: "note", kind: "tip", title: "Correction",
          v: "p->age (la flèche, car p est un pointeur). Le point e.age ne s'utilise que sur une variable." },
      ]},
    ],
  },
  {
    id: "i-liste", subject: "info", title: "Listes chaînées", sub: "maillons · ancre · chaînage",
    blurb: "Une suite de maillons reliés par des pointeurs. Taille variable, insertion rapide.",
    sections: [
      { title: "Le concept", blocks: [
        { t: "p", v: "Chaque maillon contient une donnée et un pointeur vers le maillon SUIVANT. Le dernier pointe sur NULL. Les maillons ne sont pas contigus en mémoire." },
        { t: "table", head: ["", "Tableau", "Liste chaînée"], rows: [
          ["Taille", "Fixe (ou realloc)", "Variable, à la demande"],
          ["Accès case i", "Direct, O(1)", "Parcours, O(n)"],
          ["Insertion en tête", "Coûteux", "Rapide, O(1)"],
        ]},
        { t: "code", v: `typedef struct maillon {
    int data;
    struct maillon *suivant;
} t_maillon;

t_maillon *tete = NULL;   // ancre : liste vide` },
      ]},
      { title: "Parcourir une liste", blocks: [
        { t: "code", v: `t_maillon *c = tete;
while (c != NULL) {
    printf("%d ", c->data);
    c = c->suivant;
}` },
        { t: "note", kind: "warn", title: "Piège",
          v: "Ne jamais faire avancer l'ancre tete : on perdrait le début. On parcourt avec une copie (c)." },
      ]},
      { title: "Insertion en tête (O(1))", blocks: [
        { t: "code", v: `t_maillon* insererTete(t_maillon *tete, int v) {
    t_maillon *nv = malloc(sizeof(t_maillon));
    nv->data = v;
    nv->suivant = tete;   // pointe sur l'ancien premier
    return nv;            // le nouveau devient la tete
}
tete = insererTete(tete, 7);` },
      ]},
      { title: "Supprimer un maillon", blocks: [
        { t: "p", v: "On relie le précédent du maillon supprimé directement à son suivant, puis on libère." },
        { t: "code", v: `t_maillon* supprimer(t_maillon *tete, int v) {
    t_maillon *c = tete, *prec = NULL;
    while (c != NULL && c->data != v) {
        prec = c; c = c->suivant;
    }
    if (c == NULL) return tete;            // pas trouve
    if (prec == NULL) tete = c->suivant;   // c'etait la tete
    else prec->suivant = c->suivant;       // on "saute" c
    free(c);
    return tete;
}` },
      ]},
      { title: "Libérer toute la liste", blocks: [
        { t: "p", v: "On libère maillon par maillon en sauvegardant le suivant AVANT le free." },
        { t: "code", v: `t_maillon *c = tete;
while (c != NULL) {
    t_maillon *suiv = c->suivant;  // sauvegarder AVANT
    free(c);
    c = suiv;
}` },
      ]},
      { title: "Exemple guidé — insertion en tête", blocks: [
        { t: "p", v: "Ajouter un maillon au début d'une liste chaînée." },
        { t: "code", v: `t_maillon *nv = malloc(sizeof(t_maillon));
nv->data = valeur;
nv->suivant = tete;
tete = nv;` },
        { t: "list", v: [
          "malloc(sizeof(t_maillon)) : on crée le nouveau maillon.",
          "nv->data = valeur; : on y range la donnée.",
          "nv->suivant = tete; : le nouveau maillon pointe sur l'ancien premier.",
          "tete = nv; : l'ancre pointe désormais sur le nouveau maillon.",
        ]},
        { t: "note", kind: "warn", title: "Piège fréquent",
          v: "Inverser les deux dernières lignes : si tete = nv avant nv->suivant = tete, le maillon pointe sur lui-même et le reste de la liste est perdu." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "Dans une liste chaînée, sur quoi pointe le champ suivant du DERNIER maillon ?" },
        { t: "note", kind: "tip", title: "Correction",
          v: "Sur NULL. C'est ce qui permet d'arrêter un parcours : while (courant != NULL)." },
      ]},
    ],
  },
  {
    id: "i-pf", subject: "info", title: "Piles & Files", sub: "LIFO · FIFO",
    blurb: "Deux conteneurs ordonnés selon l'ordre d'arrivée. Un seul élément accessible.",
    sections: [
      { title: "FIFO vs LIFO", blocks: [
        { t: "table", head: ["", "File", "Pile"], rows: [
          ["Principe", "FIFO — 1er entré, 1er sorti", "LIFO — dernier entré, 1er sorti"],
          ["Élément accessible", "Le plus ancien", "Le plus récent"],
          ["Ajout", "Enfiler", "Empiler"],
          ["Retrait", "Défiler", "Dépiler"],
        ]},
        { t: "p", v: "Insertion et suppression en temps constant O(1)." },
      ]},
      { title: "File par tableau circulaire", blocks: [
        { t: "p", v: "Tableau de taille fixe, deux indices : tête (prochain à défiler) et fin (où enfiler). Quand fin atteint la dernière case, on revient au début → tableau CIRCULAIRE." },
        { t: "note", kind: "warn", title: "Vide ou plein ?",
          v: "Si tête == fin, on ne distingue pas vide et plein. Solution : mémoriser le nombre d'éléments." },
      ]},
      { title: "File et pile par liste chaînée", blocks: [
        { t: "list", v: [
          "File : DOUBLE ancrage — ancre de tête (défiler) et ancre de fin (enfiler).",
          "Pile : une SEULE ancre, le sommet (empiler et dépiler du même côté).",
        ]},
        { t: "code", v: `typedef struct file {
    t_maillonF *tete;  // defiler ici
    t_maillonF *fin;   // enfiler ici
} t_file;

typedef struct pile {
    t_maillonP *sommet;  // une seule ancre
} t_pile;` },
      ]},
      { title: "Domaines d'application", blocks: [
        { t: "table", head: ["File (FIFO)", "Pile (LIFO)"], rows: [
          ["Gestion des processus (OS)", "Pile d'appels & récursivité"],
          ["Files d'attente, services", "Annulation d'actions (Undo)"],
          ["Parcours en largeur", "Parcours en profondeur"],
        ]},
      ]},
      { title: "Algorithme clé — inverser une file", blocks: [
        { t: "list", v: [
          "Pile vide P.",
          "Tant que F non vide : défiler F, empiler dans P.",
          "Tant que P non vide : dépiler P, enfiler dans F.",
        ]},
        { t: "note", kind: "info", title: "Pourquoi ça marche",
          v: "La pile inverse l'ordre (LIFO). Une 2e file ne ferait que recopier dans le même ordre." },
      ]},
      { title: "Exemple guidé — somme d'une file sans la modifier", blocks: [
        { t: "p", v: "Parcourir une file en la laissant intacte : on défile puis on réenfile chaque élément." },
        { t: "code", v: `int somme = 0;
int n = tailleFile(f);
for (int i = 0; i < n; i++) {
    int x = defiler(f);
    somme += x;
    enfiler(f, x);
}` },
        { t: "list", v: [
          "tailleFile(f) : on fixe le nombre de tours AVANT la boucle.",
          "defiler(f) : on retire l'élément de tête.",
          "somme += x; : on l'ajoute au total.",
          "enfiler(f, x) : on le remet en queue — après n tours, la file a fait un tour complet.",
        ]},
        { t: "note", kind: "warn", title: "Piège fréquent",
          v: "Boucler tant que la file n'est pas vide en réenfilant : la file ne se vide jamais → boucle infinie. Il faut compter n tours." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "On empile 1, 2, 3 dans une pile, puis on dépile une fois. Quel élément sort ?" },
        { t: "note", kind: "tip", title: "Correction",
          v: "Le 3 : une pile est LIFO (dernier entré, premier sorti)." },
      ]},
    ],
  },
  {
    id: "i-tas", subject: "info", title: "Tas / File de priorité", sub: "tas_max · priorité",
    blurb: "Une file où ce n'est plus l'ordre d'arrivée qui compte, mais une priorité.",
    sections: [
      { title: "Principe de la file de priorité", blocks: [
        { t: "p", v: "Dans un tas_max, l'élément de plus haute priorité (plus grande clé) est toujours à la RACINE : il sortira en premier, quel que soit son ordre d'arrivée." },
        { t: "code", v: `typedef struct noeud {
    int cle;       // la priorite
    void *data;    // la donnee
} t_noeud;

typedef struct tas {
    t_noeud *tab;
    int tailleM;   // capacite
    int n;         // nb d'elements
} t_tas;` },
      ]},
      { title: "Les sous-programmes du tas", blocks: [
        { t: "table", head: ["Sous-programme", "Rôle"], rows: [
          ["init_tas(&t, tM)", "Initialise un tas vide"],
          ["tasVide(&t)", "Retourne 1 si vide"],
          ["ajouter_au_tas(&t, noeud)", "Ajoute un nœud (copie)"],
          ["supprimer_du_tas(&t)", "Retire la racine (plus grande clé)"],
          ["consulter(&t)", "Donne la racine sans la retirer"],
        ]},
        { t: "code", v: `t_noeud nouveau;
nouveau.cle  = p->priorite;   // la cle = la priorite
nouveau.data = p;             // pointeur vers la donnee
ajouter_au_tas(&t, nouveau);` },
        { t: "note", kind: "info", title: "Schéma type — urgences",
          v: "Patients : file d'attente FIFO à l'arrivée → un médecin attribue une priorité → insertion dans le tas → traitement par priorité décroissante." },
      ]},
    ],
  },
  {
    id: "i-rec", subject: "info", title: "Récursivité", sub: "cas de base · pile d'appels",
    blurb: "Résoudre un problème en s'appelant soi-même sur un sous-problème plus petit.",
    sections: [
      { title: "Démarche récursive", blocks: [
        { t: "list", v: [
          "Cas de base : on sait résoudre le problème minimal directement.",
          "Cas récursif : on exprime la solution de taille n via celle de taille n-1.",
          "Pour un niveau n, l'algorithme se rappelle sur le niveau n-1.",
        ]},
        { t: "note", kind: "warn", title: "Terminaison",
          v: "Sans cas de base atteignable → récursion infinie → débordement de pile." },
      ]},
      { title: "La pile d'appels", blocks: [
        { t: "p", v: "Chaque appel empile une frame (adresse de retour, paramètres, variables locales). La pile fonctionne en LIFO : on revient toujours dans le dernier appelant." },
      ]},
      { title: "Exemple — factorielle", blocks: [
        { t: "code", v: `int fact(int n) {
    if (n == 0) return 1;        // cas de base
    return n * fact(n - 1);      // cas recursif
}` },
        { t: "p", v: "Empilement : fact(4)→fact(3)→…→fact(0). Le cas de base renvoie 1, puis on dépile en multipliant : 1, 1, 2, 6, 24." },
      ]},
      { title: "Tours de Hanoï", blocks: [
        { t: "code", v: `hanoi(i, j, n):              // n anneaux de i vers j
  si n == 1 : deplacer 1 anneau de i vers j
  sinon :
    k = 3 - i - j            // tour intermediaire
    hanoi(i, k, n-1)
    deplacer 1 anneau de i -> j
    hanoi(k, j, n-1)` },
      ]},
      { title: "Exemple guidé — factorielle récursive", blocks: [
        { t: "p", v: "Une fonction récursive doit toujours avoir un cas de base qui arrête la récursion." },
        { t: "code", v: `int fact(int n) {
    if (n <= 1) return 1;
    return n * fact(n - 1);
}` },
        { t: "list", v: [
          "if (n <= 1) return 1; : cas de base — il stoppe la récursion.",
          "return n * fact(n - 1); : cas récursif — l'appel se rapproche du cas de base.",
          "fact(3) = 3 * fact(2) = 3 * 2 * fact(1) = 3 * 2 * 1 = 6.",
          "Chaque appel est empilé sur la pile d'appels, puis dépilé au retour.",
        ]},
        { t: "note", kind: "warn", title: "Piège fréquent",
          v: "Oublier le cas de base : la récursion ne s'arrête jamais → débordement de la pile d'appels (stack overflow)." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "Que se passe-t-il si on retire la ligne if (n <= 1) return 1; de la fonction fact ?" },
        { t: "note", kind: "tip", title: "Correction",
          v: "Sans cas de base, fact s'appelle indéfiniment : la pile d'appels déborde et le programme plante." },
      ]},
    ],
  },
  {
    id: "i-fich", subject: "info", title: "Fichiers texte & binaires", sub: "fopen · fprintf · fwrite · fclose",
    blurb: "Lire et écrire sur le disque pour que les données survivent à la fin du programme.",
    sections: [
      { title: "Pourquoi des fichiers ?", blocks: [
        { t: "p", v: "Les variables disparaissent à la fin du programme. Un fichier permet la PERSISTANCE : sauvegarder des données et les recharger ultérieurement (scores, configuration, données utilisateur)." },
      ]},
      { title: "Ouvrir et fermer", blocks: [
        { t: "table", head: ["Mode", "Effet"], rows: [
          ["\"r\"", "Lecture (le fichier doit exister)"],
          ["\"w\"", "Écriture (crée / écrase)"],
          ["\"a\"", "Ajout à la fin"],
          ["\"rb\" / \"wb\"", "Lecture / écriture binaire"],
        ]},
        { t: "code", v: `FILE *f = fopen("data.txt", "r");
if (f == NULL) { printf("Erreur\\n"); return 1; }
... // lecture / ecriture
fclose(f);` },
      ]},
      { title: "Fichiers texte", blocks: [
        { t: "code", v: `// ecriture
fprintf(f, "%d\\n", n);
for (int i = 0; i < n; i++)
    fprintf(f, "%f\\n", tab[i]);

// lecture
fscanf(f, "%d", &n);
for (int i = 0; i < n; i++)
    fscanf(f, "%f", &tab[i]);` },
        { t: "note", kind: "tip", title: "Astuce",
          v: "Écrire le NOMBRE d'éléments en première ligne : au chargement on sait combien allouer (malloc)." },
      ]},
      { title: "Fichiers binaires", blocks: [
        { t: "p", v: "Un fichier binaire stocke les octets bruts de la mémoire : compact et rapide, mais non lisible. Modes \"rb\" / \"wb\"." },
        { t: "code", v: `FILE *f = fopen("data.bin", "wb");
fwrite(tab, sizeof(int), n, f);   // n entiers d'un coup
fclose(f);

FILE *g = fopen("data.bin", "rb");
fread(tab, sizeof(int), n, g);
fclose(g);` },
      ]},
      { title: "Pièges fichiers", blocks: [
        { t: "list", v: [
          "Oublier de tester le retour de fopen.",
          "Oublier fclose → données non écrites.",
          "Mauvais mode : \"w\" écrase le fichier !",
        ]},
      ]},
    ],
  },
  {
    id: "i-outils", subject: "info", title: "Boîte à outils C", sub: "fonctions · méthode · erreurs",
    blurb: "Les fonctions de la bibliothèque standard, et la méthode pour lire et écrire du code.",
    sections: [
      { title: "string.h — les chaînes", blocks: [
        { t: "table", head: ["Fonction", "Rôle"], rows: [
          ["strlen(s)", "Longueur (sans le '\\0')"],
          ["strcpy(dst, src)", "Copier src dans dst"],
          ["strcmp(a, b)", "Comparer : 0 si égales"],
          ["strcat(dst, src)", "Concaténer src à dst"],
          ["strcspn(s, \"\\n\")", "Position du 1er '\\n' (pour le retirer)"],
        ]},
      ]},
      { title: "stdlib.h — utilitaires", blocks: [
        { t: "table", head: ["Fonction", "Rôle"], rows: [
          ["malloc / calloc / realloc / free", "Gestion mémoire dynamique"],
          ["rand() % k", "Aléatoire entre 0 et k-1"],
          ["srand(time(NULL))", "Initialiser l'aléatoire"],
          ["exit(1)", "Arrêter le programme"],
          ["atoi(s)", "Chaîne → entier"],
        ]},
      ]},
      { title: "Méthode — comprendre un code", blocks: [
        { t: "list", v: [
          "Lire le PROTOTYPE et le commentaire : que reçoit / que retourne la fonction ?",
          "Repérer la STRUCTURE : boucles, conditions, appels.",
          "EXÉCUTER À LA MAIN avec un petit exemple concret.",
          "Suivre les VARIABLES dans un tableau (valeur après chaque tour).",
          "Conclure : décrire en une phrase ce que fait le code.",
        ]},
      ]},
      { title: "Méthode — écrire un algorithme", blocks: [
        { t: "list", v: [
          "1. Lire le prototype : noms et types des paramètres, type de retour.",
          "2. Faire un exemple À LA MAIN pour comprendre le résultat attendu.",
          "3. Décrire les étapes EN FRANÇAIS.",
          "4. Traduire chaque étape en C, une par une.",
          "5. Vérifier : cas limites (vide, n=0), libération mémoire, valeur de retour.",
        ]},
        { t: "note", kind: "tip", title: "Le déclic « je sais pas commencer »",
          v: "Si tu comprends mais n'arrives pas à démarrer : écris d'abord en français, puis traduis ligne par ligne. Ne saute jamais l'étape 3." },
      ]},
      { title: "Erreurs classiques transversales", blocks: [
        { t: "table", head: ["Erreur", "Conséquence"], rows: [
          ["Oublier le & dans scanf", "Écriture sur adresse invalide"],
          ["Boucle i <= n au lieu de i < n", "Dépassement de tableau"],
          ["Oublier free()", "Fuite mémoire"],
          ["Utiliser un pointeur après free()", "Crash"],
          ["= au lieu de == dans un test", "Affectation au lieu de comparaison"],
          ["Pas de cas de base en récursif", "Débordement de pile"],
        ]},
      ]},
    ],
  },
  {
    id: "i-alg", subject: "info", title: "Allegro 4", sub: "librairie graphique",
    blurb: "Bibliothèque graphique C : images, formes, clavier, souris, boucle de jeu, collisions.",
    sections: [
      { title: "Structure d'un programme", blocks: [
        { t: "code", v: `#include <allegro.h>
int main() {
    allegro_init();
    install_keyboard();
    install_mouse();
    set_gfx_mode(GFX_AUTODETECT_WINDOWED, 800, 600, 0, 0);
    // ... boucle ...
    return 0;
} END_OF_MAIN();` },
        { t: "note", kind: "info", title: "END_OF_MAIN()",
          v: "Macro OBLIGATOIRE d'Allegro, pour la compatibilité multi-plateforme." },
      ]},
      { title: "La structure BITMAP", blocks: [
        { t: "p", v: "Une BITMAP est une image en mémoire. screen est la BITMAP de l'écran. Toute BITMAP créée/chargée doit être détruite." },
        { t: "code", v: `BITMAP *img = load_bitmap("perso.bmp", NULL);
BITMAP *buf = create_bitmap(800, 600);
destroy_bitmap(img);   // comme un free` },
      ]},
      { title: "Affichage d'images & dessin", blocks: [
        { t: "code", v: `blit(img, buffer, 0,0, x,y, img->w, img->h);
draw_sprite(buffer, sprite, x, y);   // ignore le magenta
int rouge = makecol(255, 0, 0);
rectfill(buffer, x1,y1, x2,y2, rouge);
circlefill(buffer, x, y, r, rouge);` },
        { t: "note", kind: "info", title: "Pixels magenta",
          v: "Le magenta (255,0,255) est la couleur de transparence : draw_sprite l'ignore pour n'afficher que la forme." },
      ]},
      { title: "Clavier, souris, texte", blocks: [
        { t: "code", v: `if (key[KEY_RIGHT]) joueur.x += 5;
if (mouse_b & 1) /* clic gauche */ ;
textprintf_ex(buffer, font, x, y,
              makecol(255,255,255), -1, "SCORE = %d", score);` },
      ]},
      { title: "Boucle de jeu & double buffering", blocks: [
        { t: "code", v: `while (!key[KEY_ESC]) {
    // 1. entrees    : clavier / souris
    // 2. mise a jour : positions, collisions, score
    // 3. affichage  :
    clear_to_color(buffer, fond);
    blit(decor, buffer, 0,0,0,0, W, H);
    draw_sprite(buffer, sprite, x, y);
    blit(buffer, screen, 0,0,0,0, W, H);
}` },
        { t: "note", kind: "tip", title: "Double buffering",
          v: "On dessine tout sur un buffer puis on le copie d'un coup → plus de clignotement." },
      ]},
      { title: "Collisions", blocks: [
        { t: "p", v: "Entre acteurs : test sur les coordonnées (rectangles). Avec le décor : test sur la couleur des pixels (getpixel)." },
        { t: "code", v: `if (a1->x <= a2->x + a2->tx && a2->x <= a1->x + a1->tx &&
    a1->y <= a2->y + a2->ty && a2->y <= a1->y + a1->ty)
    // collision entre 2 acteurs` },
      ]},
    ],
  },
];

/* ================== FICHES — MATHÉMATIQUES ================== */

const FICHES_MATH = [
  {
    id: "m-dl", subject: "math", title: "Développements limités", sub: "Taylor-Young · DL usuels",
    blurb: "Approcher une fonction près d'un point par un polynôme. L'outil n°1 pour les limites.",
    sections: [
      { title: "Idée et formule de Taylor-Young", blocks: [
        { t: "p", v: "Un DL(a, n) approche f près de a par un polynôme de degré n, avec un reste négligeable o((x−a)ⁿ)." },
        { t: "formula", tex: "f(x) = \\sum_{k=0}^{n} \\dfrac{f^{(k)}(a)}{k!}\\,(x-a)^k \\;+\\; o\\!\\left((x-a)^n\\right)", note: "Formule de Taylor-Young — le DL d'ordre n au point a." },
        { t: "note", kind: "tip", title: "À comprendre",
          v: "Le DL en a se ramène toujours au DL en 0 en posant X = x − a (qui tend vers 0)." },
      ]},
      { title: "Les DL en 0 à connaître par cœur", blocks: [
        { t: "formula", tex: [
          "e^{x} = 1 + x + \\dfrac{x^2}{2!} + \\dfrac{x^3}{3!} + \\cdots + \\dfrac{x^n}{n!} + o(x^n)",
          "\\ln(1+x) = x - \\dfrac{x^2}{2} + \\dfrac{x^3}{3} - \\cdots + o(x^n)",
          "\\sin x = x - \\dfrac{x^3}{3!} + \\dfrac{x^5}{5!} - \\cdots + o(x^{2n+1})",
          "\\cos x = 1 - \\dfrac{x^2}{2!} + \\dfrac{x^4}{4!} - \\cdots + o(x^{2n})",
          "(1+x)^{\\alpha} = 1 + \\alpha x + \\dfrac{\\alpha(\\alpha-1)}{2!}\\,x^2 + \\cdots + o(x^n)",
          "\\dfrac{1}{1-x} = 1 + x + x^2 + x^3 + \\cdots + x^n + o(x^n)",
        ], note: "Les développements limités usuels au voisinage de 0." },
        { t: "note", kind: "warn", title: "Piège fréquent",
          v: "ln(1+x) commence par x (pas 1) ; cos commence par 1 ; sin par x. Ne pas les confondre." },
      ]},
      { title: "Recette de calcul d'un DL", blocks: [
        { t: "list", v: [
          "Identifier le point a et l'ordre n demandés.",
          "Se ramener en 0 si besoin (X = x − a, ou X = 1/x pour x → ±∞).",
          "Utiliser les DL usuels + opérations : somme, produit, composition.",
          "Pour un quotient f/g : DL du premier terme non nul de g, puis division suivant les puissances croissantes.",
          "Tronquer proprement à l'ordre n (garder le o(xⁿ)).",
        ]},
        { t: "note", kind: "info", title: "Puissance variable",
          v: "Pour (f(x))^g(x), on écrit (f(x))^g(x) = e^( g(x)·ln(f(x)) ) puis on fait le DL de l'exposant." },
      ]},
      { title: "Applications : limites et tangentes", blocks: [
        { t: "p", v: "Équivalent : le premier terme non nul du DL. Ex : sin(x) ∼₀ x, eˣ−1 ∼₀ x." },
        { t: "code", v: `lim f(x)/g(x) en a :
  on remplace f et g par leurs equivalents simples.

Tangente en a :  Δ : y = f(a) + f'(a)(x−a)
Position courbe/tangente : signe du 1er terme
suivant dans le DL ( f⁽ᵏ⁾(a)/k! (x−a)ᵏ ).` },
      ]},
      { title: "Exemple guidé — limite par DL", blocks: [
        { t: "p", v: "Calculer la limite quand x tend vers 0 de (eˣ − 1 − x) / x²." },
        { t: "list", v: [
          "Repérer la forme indéterminée : 0/0.",
          "Écrire le DL du numérateur à un ordre suffisant (ordre 2).",
          "Simplifier le quotient.",
          "Conclure.",
        ]},
        { t: "formula", tex: "\\dfrac{e^{x}-1-x}{x^{2}} = \\dfrac{\\tfrac{x^2}{2} + o(x^2)}{x^2} = \\tfrac{1}{2} + o(1)", note: "Limite = 1/2." },
        { t: "note", kind: "warn", title: "Piège fréquent",
          v: "Faire le DL à un ordre trop faible : il faut aller jusqu'à l'ordre qui donne le premier terme non nul." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "Donne le développement limité de cos(x) en 0 à l'ordre 4." },
        { t: "formula", tex: "\\cos x = 1 - \\dfrac{x^2}{2!} + \\dfrac{x^4}{4!} + o(x^4)", note: "Correction : cos n'a que des puissances paires." },
      ]},
    ],
  },
  {
    id: "m-int", subject: "math", title: "Intégrales généralisées", sub: "convergence · Riemann · critères",
    blurb: "Donner un sens à une intégrale sur un intervalle infini ou avec une borne problématique.",
    sections: [
      { title: "Définition de la convergence", blocks: [
        { t: "p", v: "Une intégrale est généralisée si une borne est infinie, ou si la fonction n'est pas définie en une borne." },
        { t: "code", v: `f continue sur [a, +∞[ :
  ∫ₐ^{+∞} f converge  ⟺  lim(X→+∞) ∫ₐ^X f  existe et finie.

f continue sur [a, b[ :
  ∫ₐ^b f converge  ⟺  lim(X→b⁻) ∫ₐ^X f  existe et finie.` },
        { t: "note", kind: "info", title: "Plusieurs bornes",
          v: "Si plusieurs bornes posent problème, on découpe avec la relation de Chasles pour isoler chaque problème." },
      ]},
      { title: "Intégrales de Riemann (référence)", blocks: [
        { t: "formula", tex: [
          "\\int_{1}^{+\\infty} \\dfrac{dx}{x^{\\alpha}} \\ \\text{converge} \\iff \\alpha > 1",
          "\\int_{0}^{1} \\dfrac{dx}{x^{\\beta}} \\ \\text{converge} \\iff \\beta < 1",
        ], note: "Intégrales de Riemann de référence." },
        { t: "note", kind: "tip", title: "Mémo",
          v: "À l'infini il faut que ça décroisse VITE (α>1). En 0 il faut que ça explose LENTEMENT (β<1)." },
      ]},
      { title: "Critères de convergence (fonctions positives)", blocks: [
        { t: "list", v: [
          "Comparaison : si 0 ≤ f ≤ g, alors g converge ⟹ f converge ; f diverge ⟹ g diverge.",
          "Équivalence : si f ∼ g au voisinage de la borne, alors ∫f et ∫g sont de même nature.",
          "Négligeabilité : si f = o(g), alors g converge ⟹ f converge.",
        ]},
        { t: "note", kind: "tip", title: "Méthode type",
          v: "On cherche un équivalent simple de f en la borne, puis on compare à une intégrale de Riemann." },
      ]},
      { title: "Signe non constant : convergence absolue", blocks: [
        { t: "p", v: "Si la fonction change de signe, on étudie ∫|f|." },
        { t: "code", v: `∫f absolument convergente  ⟺  ∫|f| converge
∫|f| converge   ⟹   ∫f converge` },
      ]},
      { title: "Exemple guidé — nature d'une intégrale", blocks: [
        { t: "p", v: "Étudier la nature de l'intégrale de 1 à +∞ de dx/(x√x)." },
        { t: "list", v: [
          "Repérer la borne problématique : ici +∞.",
          "Écrire la fonction sous forme de puissance : 1/(x√x) = x^(−3/2).",
          "Comparer à une intégrale de Riemann.",
          "Conclure avec le critère α > 1.",
        ]},
        { t: "formula", tex: "\\int_{1}^{+\\infty} \\dfrac{dx}{x\\sqrt{x}} = \\int_{1}^{+\\infty} \\dfrac{dx}{x^{3/2}} \\quad\\Rightarrow\\quad \\alpha = \\tfrac{3}{2} > 1", note: "α = 3/2 > 1 : l'intégrale CONVERGE." },
        { t: "note", kind: "warn", title: "Piège fréquent",
          v: "Inverser le critère : à l'infini il faut α > 1, mais en 0 il faut β < 1." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "L'intégrale de 1 à +∞ de dx/x converge-t-elle ?" },
        { t: "note", kind: "tip", title: "Correction",
          v: "Non : α = 1, et le critère de Riemann à l'infini exige α > 1 strictement. Elle diverge." },
      ]},
    ],
  },
  {
    id: "m-mat", subject: "math", title: "Matrices", sub: "opérations · inverse · systèmes",
    blurb: "Tableaux de nombres qui représentent des transformations et des systèmes linéaires.",
    sections: [
      { title: "Opérations de base", blocks: [
        { t: "list", v: [
          "Somme A + B : terme à terme (mêmes dimensions).",
          "Produit AB : défini si nb colonnes de A = nb lignes de B. Non commutatif (AB ≠ BA).",
          "(AB)ᵢⱼ = somme sur k de Aᵢₖ · Bₖⱼ.",
          "Identité I : élément neutre du produit (AI = IA = A).",
        ]},
        { t: "note", kind: "warn", title: "Piège",
          v: "AB ≠ BA en général, et AB = 0 n'implique pas A = 0 ou B = 0." },
      ]},
      { title: "Matrice inverse", blocks: [
        { t: "p", v: "A est inversible s'il existe A⁻¹ telle que A·A⁻¹ = A⁻¹·A = I. Équivalent : det(A) ≠ 0." },
        { t: "formula", tex: "A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\qquad A^{-1} = \\dfrac{1}{ad-bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}", note: "Inverse d'une matrice 2×2 (si ad − bc ≠ 0). Cas général : Gauss-Jordan sur (A | I) jusqu'à (I | A⁻¹)." },
      ]},
      { title: "Systèmes linéaires AX = B", blocks: [
        { t: "p", v: "Un système linéaire s'écrit sous forme matricielle AX = B." },
        { t: "list", v: [
          "Méthode de l'inverse : si A inversible, X = A⁻¹ B.",
          "Méthode de Gauss : échelonner la matrice augmentée (A | B) puis remonter.",
          "Solution unique ⟺ A inversible ⟺ det(A) ≠ 0.",
        ]},
        { t: "code", v: `Exemple :  x + 3y + 2z = 2
           2x + 7y + 7z = −1
           2x + 5y + 2z = 7

         | 1 3 2 |        | x |        |  2 |
   A =   | 2 7 7 |   X =  | y |   B =  | −1 |
         | 2 5 2 |        | z |        |  7 |` },
      ]},
      { title: "Exemple guidé — inverser une matrice 2×2", blocks: [
        { t: "p", v: "Inverser la matrice A formée de la première ligne (2, 1) et de la seconde ligne (3, 4)." },
        { t: "list", v: [
          "Calculer le déterminant : det = ad − bc.",
          "Vérifier qu'il est non nul (sinon A n'est pas inversible).",
          "Échanger a et d, changer le signe de b et c.",
          "Diviser toute la matrice par le déterminant.",
        ]},
        { t: "formula", tex: "\\det(A) = 2\\cdot 4 - 1\\cdot 3 = 5 \\qquad A^{-1} = \\dfrac{1}{5}\\begin{pmatrix} 4 & -1 \\\\ -3 & 2 \\end{pmatrix}", note: "On échange la diagonale, on oppose les autres termes, on divise par det." },
        { t: "note", kind: "warn", title: "Piège fréquent",
          v: "Appliquer la formule alors que det(A) = 0 : la matrice n'est alors PAS inversible." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "Quel est le déterminant de la matrice de lignes (1, 2) et (2, 4) ? Est-elle inversible ?" },
        { t: "note", kind: "tip", title: "Correction",
          v: "det = 1×4 − 2×2 = 0 : la matrice n'est PAS inversible (lignes proportionnelles)." },
      ]},
    ],
  },
  {
    id: "m-det", subject: "math", title: "Déterminants", sub: "calcul · propriétés · inversibilité",
    blurb: "Un nombre associé à une matrice carrée : il dit si elle est inversible.",
    sections: [
      { title: "Calcul du déterminant", blocks: [
        { t: "formula", tex: [
          "\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc",
          "\\det\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix} = aei + bfg + cdh - ceg - bdi - afh",
        ], note: "Déterminant 2×2, et 3×3 par la règle de Sarrus." },
        { t: "p", v: "En dimension n : développement par rapport à une ligne ou une colonne (cofacteurs)." },
      ]},
      { title: "Développement par cofacteurs", blocks: [
        { t: "formula", tex: "\\det(A) = \\sum_{j} (-1)^{\\,i+j}\\; a_{ij}\\; M_{ij}", note: "Développement par cofacteurs : Mᵢⱼ est le mineur, déterminant de la matrice privée de la ligne i et de la colonne j." },
        { t: "note", kind: "tip", title: "Astuce",
          v: "Développer selon la ligne ou la colonne qui contient le plus de zéros : moins de calculs." },
      ]},
      { title: "Propriétés essentielles", blocks: [
        { t: "list", v: [
          "Échanger deux lignes change le signe du déterminant.",
          "Ajouter à une ligne un multiple d'une autre ne change pas le déterminant.",
          "det(AB) = det(A)·det(B) ; det(Aᵀ) = det(A).",
          "Une ligne (ou colonne) nulle, ou deux lignes proportionnelles ⟹ det = 0.",
        ]},
        { t: "note", kind: "info", title: "Le lien clé",
          v: "A est inversible ⟺ det(A) ≠ 0. Si det(A) = 0, le système AX = B n'a pas de solution unique." },
      ]},
      { title: "Exemple guidé — déterminant 3×3", blocks: [
        { t: "p", v: "Calculer un déterminant 3×3 avec la règle de Sarrus." },
        { t: "list", v: [
          "Recopier les deux premières colonnes à droite de la matrice.",
          "Additionner les trois produits des diagonales descendantes.",
          "Soustraire les trois produits des diagonales montantes.",
        ]},
        { t: "formula", tex: "\\det\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix} = aei + bfg + cdh - ceg - bdi - afh", note: "Trois produits descendants (+), trois produits montants (−)." },
        { t: "note", kind: "warn", title: "Piège fréquent",
          v: "Utiliser Sarrus sur une matrice 4×4 : la règle ne marche QUE pour les 3×3." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "Une matrice est triangulaire (tous les termes sous la diagonale sont nuls). Comment calculer son déterminant ?" },
        { t: "note", kind: "tip", title: "Correction",
          v: "C'est simplement le produit des termes de la diagonale." },
      ]},
    ],
  },
  {
    id: "m-equiv", subject: "math", title: "Équivalents & limites", sub: "équivalents · DL · formes indéterminées",
    blurb: "Utiliser les équivalents et les développements limités pour lever les formes indéterminées.",
    sections: [
      { title: "Notion d'équivalent", blocks: [
        { t: "p", v: "Deux fonctions sont équivalentes en a si leur rapport tend vers 1. En pratique, l'équivalent d'une fonction en a est le PREMIER TERME NON NUL de son développement limité." },
        { t: "formula", tex: [
          "\\sin x \\sim x \\qquad \\tan x \\sim x \\qquad e^{x}-1 \\sim x",
          "\\ln(1+x) \\sim x \\qquad 1-\\cos x \\sim \\dfrac{x^2}{2} \\qquad (1+x)^{\\alpha}-1 \\sim \\alpha x",
        ], note: "Équivalents usuels au voisinage de 0." },
      ]},
      { title: "Règles d'utilisation", blocks: [
        { t: "list", v: [
          "Un équivalent se substitue dans un PRODUIT ou un QUOTIENT.",
          "Jamais dans une SOMME : remplacer chaque terme isolément donne un résultat faux.",
          "Jamais à l'intérieur d'un ln, d'une exponentielle ou d'une puissance.",
        ]},
        { t: "note", kind: "warn", title: "Le piège n°1",
          v: "sin(x) − x : remplacer sin(x) par x donnerait 0, ce qui est faux. Dans une soustraction qui s'annule, il faut le DL, pas l'équivalent." },
      ]},
      { title: "Méthode — limite par DL", blocks: [
        { t: "list", v: [
          "Repérer la forme indéterminée (0/0, ∞−∞, 1^∞…).",
          "Écrire le DL du numérateur et du dénominateur à un ordre suffisant.",
          "Simplifier le quotient en gardant le terme dominant.",
          "Conclure la limite.",
        ]},
        { t: "code", v: `Exemple :  lim(x→0) (eˣ − 1 − x) / x²

eˣ − 1 − x = x²/2 + o(x²)
(eˣ − 1 − x)/x² = 1/2 + o(1)

⟹  limite = 1/2` },
      ]},
      { title: "Forme puissance 1^∞", blocks: [
        { t: "p", v: "Pour une limite du type f(x)^g(x), on passe par l'exponentielle." },
        { t: "code", v: `f^g = e^( g · ln(f) )

On fait le DL de l'exposant g·ln(f),
puis on applique l'exponentielle à la limite.` },
      ]},
      { title: "Exemple guidé — limite par équivalents", blocks: [
        { t: "p", v: "Calculer la limite quand x tend vers 0 de (1 − cos x) / (x · sin x)." },
        { t: "list", v: [
          "Repérer la forme indéterminée 0/0.",
          "Remplacer chaque FACTEUR par son équivalent en 0.",
          "Simplifier le quotient.",
        ]},
        { t: "formula", tex: "\\dfrac{1-\\cos x}{x\\,\\sin x} \\sim \\dfrac{x^2/2}{x\\cdot x} = \\dfrac{1}{2}", note: "1 − cos x ∼ x²/2 et sin x ∼ x : limite = 1/2." },
        { t: "note", kind: "warn", title: "Piège fréquent",
          v: "Utiliser un équivalent dans une somme : il ne se substitue que dans un produit ou un quotient." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "Quelle est la limite de sin(x)/x quand x tend vers 0 ?" },
        { t: "note", kind: "tip", title: "Correction",
          v: "1, car sin x ∼ x au voisinage de 0." },
      ]},
    ],
  },
  {
    id: "m-sys", subject: "math", title: "Systèmes linéaires & Gauss", sub: "AX = B · pivot · inversibilité",
    blurb: "Résoudre un système d'équations linéaires par la méthode du pivot de Gauss.",
    sections: [
      { title: "Écriture matricielle", blocks: [
        { t: "p", v: "Tout système linéaire se met sous la forme AX = B : A contient les coefficients, X les inconnues, B les seconds membres." },
        { t: "code", v: `  x + 2y −  z = 3            | 1  2 −1 | | x |   | 3 |
 2x − y + 3z = 1     ⟺      | 2 −1  3 | | y | = | 1 |
 −x + y +  z = 0            |−1  1  1 | | z |   | 0 |` },
      ]},
      { title: "Méthode du pivot de Gauss", blocks: [
        { t: "list", v: [
          "Former la matrice augmentée (A | B).",
          "Choisir un pivot (terme non nul) et éliminer les termes sous lui.",
          "Répéter colonne par colonne pour obtenir une forme triangulaire.",
          "Remonter : trouver la dernière inconnue, puis les précédentes.",
        ]},
        { t: "code", v: `Opérations autorisées sur les lignes :
  - échanger deux lignes
  - multiplier une ligne par un réel non nul
  - ajouter à une ligne un multiple d'une autre

Lᵢ ← Lᵢ − (aᵢₖ/pivot)·Lₖ` },
      ]},
      { title: "Discussion des solutions", blocks: [
        { t: "table", head: ["Après échelonnement", "Conclusion"], rows: [
          ["Un pivot par inconnue", "Solution unique"],
          ["Ligne 0 = 0 (surnuméraire)", "Infinité de solutions"],
          ["Ligne 0 = c (c ≠ 0)", "Aucune solution"],
        ]},
        { t: "note", kind: "info", title: "Lien avec le déterminant",
          v: "Si A est carrée : solution unique ⟺ det(A) ≠ 0 ⟺ A inversible. On peut alors aussi écrire X = A⁻¹B." },
      ]},
      { title: "Inversibilité", blocks: [
        { t: "list", v: [
          "A inversible ⟺ det(A) ≠ 0 ⟺ Gauss donne un pivot par colonne.",
          "Calcul de A⁻¹ : appliquer Gauss-Jordan à (A | I) jusqu'à (I | A⁻¹).",
          "Si une ligne de zéros apparaît à gauche : A n'est pas inversible.",
        ]},
      ]},
    ],
  },
];

/* ================== FICHES — MÉCANIQUE ================== */

const FICHES_MECA = [
  {
    id: "me-trav", subject: "meca", title: "Travail & puissance", sub: "force · énergie · puissance",
    blurb: "Comment une force transfère de l'énergie à un système en mouvement.",
    sections: [
      { title: "Travail d'une force", blocks: [
        { t: "p", v: "Le travail d'une force est l'énergie que cette force transfère au système. Il dépend du déplacement." },
        { t: "code", v: `Travail élémentaire :   δW = F⃗ · dl⃗

Travail total (de A à B) :
   W(A→B) = ∫_AB  F⃗ · dl⃗

Force constante :  W = F⃗ · AB⃗ = F·AB·cos(θ)` },
        { t: "note", kind: "tip", title: "Signe du travail",
          v: "W > 0 : force motrice (accélère). W < 0 : force résistante (freine, ex : frottements)." },
      ]},
      { title: "Puissance", blocks: [
        { t: "code", v: `Puissance instantanée :   P = δW/dt = F⃗ · v⃗

Puissance moyenne :   P_moy = W / Δt

Unité : le watt (W) = J/s` },
      ]},
      { title: "Théorème de l'énergie cinétique (TEC)", blocks: [
        { t: "formula", tex: [
          "E_c = \\tfrac{1}{2}\\,m\\,v^2",
          "\\Delta E_c = E_c(B) - E_c(A) = \\sum W_{\\text{ext}} \\quad\\text{(TEC)}",
          "\\dfrac{dE_c}{dt} = \\sum P_{\\text{forces}} \\quad\\text{(TPC)}",
        ], note: "Énergie cinétique, théorème de l'énergie cinétique et sa forme en puissance." },
        { t: "note", kind: "info", title: "Quand l'utiliser",
          v: "Le TEC relie la variation de vitesse au travail des forces : idéal quand on cherche une vitesse." },
      ]},
      { title: "Exemple guidé — travail du poids", blocks: [
        { t: "p", v: "Un objet de masse m = 3 kg descend d'une hauteur h = 2 m. Calculer le travail du poids." },
        { t: "list", v: [
          "Identifier la force : le poids, vertical vers le bas.",
          "Le déplacement est vers le bas → même sens que la force → travail moteur (positif).",
          "Appliquer W = m·g·h pour une descente.",
        ]},
        { t: "formula", tex: "W_{\\text{poids}} = m\\,g\\,h = 3 \\times 9{,}8 \\times 2 \\approx 59\\ \\text{J}", note: "Descente : travail moteur (W > 0). Montée : travail résistant (W < 0)." },
        { t: "note", kind: "warn", title: "Piège fréquent",
          v: "Confondre travail (en joules) et puissance (en watts) : P = W/Δt." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "Un objet remonte d'une hauteur de 2 m. Le travail du poids est-il positif ou négatif ?" },
        { t: "note", kind: "tip", title: "Correction",
          v: "Négatif : le poids s'oppose à la montée, c'est un travail résistant." },
      ]},
    ],
  },
  {
    id: "me-ep", subject: "meca", title: "Énergie potentielle", sub: "forces conservatives",
    blurb: "L'énergie « stockée » par certaines forces, qui peut redonner du mouvement.",
    sections: [
      { title: "Force conservative", blocks: [
        { t: "p", v: "Une force est conservative si son travail ne dépend que du point de départ et du point d'arrivée, pas du chemin suivi." },
        { t: "code", v: `Force conservative  ⟺  il existe Ep telle que
        δW = −dEp     soit    F⃗ = −grad(Ep)

À 1 dimension :   F = −dEp/dx` },
        { t: "note", kind: "warn", title: "Non conservative",
          v: "Les frottements ne sont PAS conservatifs : leur travail dépend du trajet et dissipe l'énergie." },
      ]},
      { title: "Énergies potentielles usuelles", blocks: [
        { t: "code", v: `Pesanteur :        Ep = m·g·z   (+ constante)
Ressort :          Ep = ½ k x²  (x = allongement)
` },
        { t: "p", v: "L'énergie potentielle est définie à une constante près : on choisit librement l'origine (Ep = 0)." },
      ]},
      { title: "Équilibre et stabilité", blocks: [
        { t: "list", v: [
          "Position d'équilibre : dEp/dx = 0.",
          "Équilibre STABLE : minimum de Ep (puits de potentiel).",
          "Équilibre INSTABLE : maximum de Ep.",
        ]},
        { t: "note", kind: "info", title: "Lien avec les oscillations",
          v: "Un système oscille au fond d'un puits d'énergie potentielle autour d'une position d'équilibre stable." },
      ]},
      { title: "Exemple guidé — position d'équilibre", blocks: [
        { t: "p", v: "Pour une énergie potentielle Ep(x), trouver la position d'équilibre et dire si elle est stable." },
        { t: "list", v: [
          "Écrire l'énergie potentielle Ep(x).",
          "L'équilibre vérifie dEp/dx = 0.",
          "Minimum de Ep → équilibre stable ; maximum → instable.",
        ]},
        { t: "formula", tex: "\\dfrac{dE_p}{dx} = 0 \\quad\\text{(équilibre)} \\qquad \\dfrac{d^2 E_p}{dx^2} > 0 \\Rightarrow \\text{stable}", note: "Un puits de potentiel (minimum) correspond à un équilibre stable." },
        { t: "note", kind: "warn", title: "Piège fréquent",
          v: "Mal choisir l'origine de Ep : fixer clairement où Ep = 0 avant tout calcul." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "L'énergie potentielle d'un ressort est Ep = ½kx². Où se trouve sa position d'équilibre ?" },
        { t: "note", kind: "tip", title: "Correction",
          v: "En x = 0 : dEp/dx = kx = 0 ⇒ x = 0. C'est un minimum → équilibre stable." },
      ]},
    ],
  },
  {
    id: "me-em", subject: "meca", title: "Énergie mécanique", sub: "TEM · conservation",
    blurb: "La somme cinétique + potentielle : conservée si pas de frottements.",
    sections: [
      { title: "Définition et théorème", blocks: [
        { t: "formula", tex: [
          "E_m = E_c + E_p",
          "\\Delta E_m = W_{\\text{non conservatives}} \\quad\\text{(TEM)}",
        ], note: "L'énergie mécanique ne varie que sous l'effet des forces non conservatives." },
        { t: "p", v: "Les forces conservatives sont déjà comptées dans Ep : seules les forces non conservatives font varier Em." },
      ]},
      { title: "Conservation de l'énergie", blocks: [
        { t: "list", v: [
          "Système conservatif (pas de frottements) : Em = constante.",
          "Avec frottements : Em diminue, l'énergie est dissipée (chaleur).",
          "ΔEm = W(frottements) < 0.",
        ]},
        { t: "note", kind: "tip", title: "Méthode énergétique",
          v: "Pour trouver une vitesse sans calculer les forces : écrire Em(A) = Em(B) (si conservatif)." },
      ]},
      { title: "Mise en équation d'un oscillateur", blocks: [
        { t: "p", v: "On peut obtenir l'équation du mouvement en dérivant l'énergie mécanique par rapport au temps." },
        { t: "code", v: `Système conservatif :  dEm/dt = 0

Ex (masse-ressort) : Em = ½ m ẋ² + ½ k x²
  dEm/dt = m ẋ ẍ + k x ẋ = 0
  ⟹  m ẍ + k x = 0` },
      ]},
      { title: "Exemple guidé — vitesse par conservation", blocks: [
        { t: "p", v: "Un objet part du repos et descend une pente lisse (sans frottement) de hauteur h = 5 m. Calculer sa vitesse en bas." },
        { t: "list", v: [
          "Sans frottement, l'énergie mécanique se conserve : Em(haut) = Em(bas).",
          "En haut : Ec = 0, Ep = mgh. En bas : Ec = ½mv², Ep = 0.",
          "Égaler et isoler la vitesse.",
        ]},
        { t: "formula", tex: "m g h = \\tfrac{1}{2} m v^{2} \\quad\\Rightarrow\\quad v = \\sqrt{2 g h} = \\sqrt{2 \\times 9{,}8 \\times 5} \\approx 9{,}9\\ \\text{m/s}", note: "La masse se simplifie : la vitesse ne dépend pas de m." },
        { t: "note", kind: "warn", title: "Piège fréquent",
          v: "Appliquer la conservation de Em alors qu'il y a des frottements : il faut alors le TEM." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "Un objet tombe en chute libre d'une hauteur de 20 m. Quelle est sa vitesse à l'arrivée ?" },
        { t: "note", kind: "tip", title: "Correction",
          v: "v = √(2gh) = √(2 × 9,8 × 20) ≈ 19,8 m/s." },
      ]},
    ],
  },
  {
    id: "me-osc", subject: "meca", title: "Oscillateur harmonique", sub: "libre · pulsation propre",
    blurb: "Tout système qui revient vers l'équilibre avec une force de rappel : ressort, pendule.",
    sections: [
      { title: "Équation et solution", blocks: [
        { t: "formula", tex: [
          "\\ddot{x} + \\omega_0^{2}\\,x = 0",
          "x(t) = A\\cos(\\omega_0 t + \\varphi) \\qquad T_0 = \\dfrac{2\\pi}{\\omega_0}",
        ], note: "Équation de l'oscillateur harmonique non amorti et sa solution." },
        { t: "p", v: "A (amplitude) et φ (phase) se déterminent avec les conditions initiales x(0) et ẋ(0)." },
      ]},
      { title: "Systèmes usuels", blocks: [
        { t: "formula", tex: "\\omega_0 = \\sqrt{\\dfrac{k}{m}} \\quad\\text{(masse-ressort)} \\qquad \\omega_0 = \\sqrt{\\dfrac{g}{L}} \\quad\\text{(pendule)}", note: "Pulsation propre selon le système (pendule : petits angles)." },
        { t: "note", kind: "info", title: "Ressorts équivalents",
          v: "En parallèle : k_eq = k₁ + k₂. En série : 1/k_eq = 1/k₁ + 1/k₂." },
      ]},
      { title: "Énergie de l'oscillateur", blocks: [
        { t: "formula", tex: [
          "E_c = \\tfrac{1}{2}\\,m\\,\\dot{x}^{2} \\qquad E_p = \\tfrac{1}{2}\\,k\\,x^{2}",
          "E_m = E_c + E_p = \\tfrac{1}{2}\\,k\\,A^{2} = \\text{constante}",
        ], note: "Sans amortissement, l'énergie mécanique de l'oscillateur se conserve." },
        { t: "p", v: "L'énergie passe en permanence de cinétique à potentielle et inversement, mais la somme reste constante (sans amortissement)." },
      ]},
      { title: "Exemple guidé — pulsation et période propres", blocks: [
        { t: "p", v: "Un système masse-ressort a une masse m = 0,5 kg et un ressort de raideur k = 200 N/m. Trouver sa pulsation propre et sa période." },
        { t: "list", v: [
          "Identifier le système : masse-ressort → ω₀ = √(k/m).",
          "Calculer la pulsation propre ω₀.",
          "En déduire la période T₀ = 2π/ω₀.",
        ]},
        { t: "formula", tex: "\\omega_0 = \\sqrt{\\dfrac{k}{m}} = \\sqrt{\\dfrac{200}{0{,}5}} = 20\\ \\text{rad/s} \\qquad T_0 = \\dfrac{2\\pi}{\\omega_0} \\approx 0{,}31\\ \\text{s}", note: "Ne pas oublier la racine carrée dans ω₀." },
        { t: "note", kind: "warn", title: "Piège fréquent",
          v: "Confondre pulsation ω (rad/s) et fréquence f (Hz) : ω = 2πf." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "Sur une courbe x(t), les oscillations diminuent progressivement d'amplitude. Quel régime ?" },
        { t: "note", kind: "tip", title: "Correction",
          v: "Régime pseudo-périodique : le système oscille tout en s'amortissant (Q > 1/2)." },
      ]},
    ],
  },
  {
    id: "me-amort", subject: "meca", title: "Oscillateur amorti", sub: "régimes · facteur de qualité",
    blurb: "Un oscillateur réel : les frottements dissipent l'énergie et amortissent le mouvement.",
    sections: [
      { title: "Équation du mouvement amorti", blocks: [
        { t: "p", v: "Avec une force de frottement fluide f⃗ = −λ v⃗, l'équation devient :" },
        { t: "formula", tex: [
          "\\ddot{x} + \\dfrac{\\lambda}{m}\\,\\dot{x} + \\omega_0^{2}\\,x = 0",
          "\\ddot{x} + \\dfrac{\\omega_0}{Q}\\,\\dot{x} + \\omega_0^{2}\\,x = 0 \\quad\\text{(forme canonique)}",
        ], note: "Équation de l'oscillateur amorti ; Q est le facteur de qualité." },
      ]},
      { title: "Les trois régimes", blocks: [
        { t: "table", head: ["Régime", "Condition", "Comportement"], rows: [
          ["Pseudo-périodique", "Q > 1/2 (faible amortissement)", "Oscille en s'atténuant"],
          ["Critique", "Q = 1/2", "Retour le plus rapide sans osciller"],
          ["Apériodique", "Q < 1/2 (fort amortissement)", "Retour lent sans osciller"],
        ]},
        { t: "note", kind: "tip", title: "À reconnaître",
          v: "Une courbe qui oscille en diminuant = pseudo-périodique. Une courbe qui revient sans osciller = critique/apériodique." },
      ]},
      { title: "Régime pseudo-périodique", blocks: [
        { t: "formula", tex: [
          "x(t) = A\\,e^{-t/\\tau}\\cos(\\omega t + \\varphi)",
          "T = \\dfrac{2\\pi}{\\omega}\\,, \\quad \\omega < \\omega_0",
        ], note: "Régime pseudo-périodique : oscillation sous une enveloppe décroissante en e^(−t/τ)." },
        { t: "p", v: "L'énergie mécanique décroît : elle est dissipée par les frottements. Le facteur de qualité Q mesure le nombre d'oscillations avant amortissement." },
      ]},
      { title: "Exemple guidé — identifier le régime", blocks: [
        { t: "p", v: "On observe la réponse d'un oscillateur amorti écarté puis lâché. Comment identifier son régime ?" },
        { t: "list", v: [
          "La courbe oscille en s'atténuant → régime pseudo-périodique (Q > 1/2).",
          "La courbe revient à l'équilibre sans osciller, le plus vite possible → régime critique (Q = 1/2).",
          "La courbe revient lentement sans osciller → régime apériodique (Q < 1/2).",
        ]},
        { t: "formula", tex: "\\ddot{x} + \\dfrac{\\omega_0}{Q}\\,\\dot{x} + \\omega_0^{2}\\,x = 0", note: "Le facteur de qualité Q détermine le régime." },
        { t: "note", kind: "warn", title: "Piège fréquent",
          v: "En régime pseudo-périodique, la pseudo-pulsation ω est INFÉRIEURE à ω₀." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "Quel régime ramène le système à l'équilibre le plus rapidement, sans oscillation ?" },
        { t: "note", kind: "tip", title: "Correction",
          v: "Le régime critique (Q = 1/2) : retour le plus rapide possible sans dépassement." },
      ]},
    ],
  },
  {
    id: "me-pfd", subject: "meca", title: "PFD & dynamique du point", sub: "principe fondamental · projection",
    blurb: "La loi qui relie les forces au mouvement : la méthode pour obtenir l'équation du mouvement.",
    sections: [
      { title: "Le principe fondamental de la dynamique", blocks: [
        { t: "p", v: "Dans un référentiel galiléen, la somme des forces appliquées à un point matériel est égale au produit de sa masse par son accélération." },
        { t: "formula", tex: "\\sum \\vec{F} = m\\,\\vec{a} \\qquad \\vec{a} = \\dfrac{d\\vec{v}}{dt}", note: "Principe fondamental de la dynamique, dans un référentiel galiléen." },
        { t: "note", kind: "info", title: "PFD ou énergie ?",
          v: "Le PFD donne directement l'accélération et l'équation du mouvement. Les méthodes énergétiques (TEC, TEM) sont plus rapides pour une vitesse sans calculer les forces." },
      ]},
      { title: "Méthode de résolution", blocks: [
        { t: "list", v: [
          "Définir le système et le référentiel (supposé galiléen).",
          "Faire le bilan des forces (poids, réaction, tension, frottements…).",
          "Choisir un repère et projeter le PFD sur chaque axe.",
          "Obtenir les équations, en déduire l'équation différentielle du mouvement.",
        ]},
      ]},
      { title: "Exemple — masse-ressort horizontal", blocks: [
        { t: "code", v: `Forces sur l'axe (Ox) : rappel du ressort −kx
PFD projeté sur Ox :

   m·ẍ = −k·x
   ⟹  ẍ + (k/m)·x = 0

C'est l'équation d'un oscillateur harmonique,
ω₀ = √(k/m).` },
        { t: "p", v: "Avec un frottement fluide −λẋ, on obtient m·ẍ = −kx − λẋ, soit l'équation de l'oscillateur amorti." },
      ]},
      { title: "Lecture et interprétation d'une courbe", blocks: [
        { t: "list", v: [
          "x(t) droite croissante : mouvement à vitesse constante.",
          "x(t) parabole : accélération constante (chute, plan incliné).",
          "x(t) sinusoïdale : oscillateur harmonique.",
          "Sinusoïde dont l'amplitude décroît : oscillateur amorti pseudo-périodique.",
          "Pente de x(t) = vitesse ; pente de v(t) = accélération.",
        ]},
        { t: "note", kind: "tip", title: "Repères utiles",
          v: "Sur une courbe d'oscillation : la période se lit entre deux maxima, l'amplitude est l'écart à la position d'équilibre." },
      ]},
    ],
  },
];

/* ================== FICHES — ÉLECTRONIQUE ================== */

const FICHES_ELEC = [
  {
    id: "e-lois", subject: "elec", title: "Lois fondamentales", sub: "Ohm · Kirchhoff · associations",
    blurb: "Les règles de base qui régissent tout circuit électrique en courant continu.",
    sections: [
      { title: "Grandeurs électriques", blocks: [
        { t: "table", head: ["Grandeur", "Symbole", "Unité"], rows: [
          ["Tension", "U", "Volt (V)"],
          ["Intensité du courant", "I", "Ampère (A)"],
          ["Résistance", "R", "Ohm (Ω)"],
          ["Puissance", "P", "Watt (W)"],
        ]},
        { t: "p", v: "La tension est une différence de potentiel entre deux points ; le courant est un débit de charges." },
      ]},
      { title: "Loi d'Ohm", blocks: [
        { t: "formula", tex: "U = R \\cdot I", note: "Loi d'Ohm : la tension aux bornes d'une résistance est proportionnelle au courant qui la traverse." },
        { t: "p", v: "Puissance dissipée par une résistance : P = U·I = R·I² = U²/R." },
      ]},
      { title: "Lois de Kirchhoff", blocks: [
        { t: "list", v: [
          "Loi des nœuds : la somme des courants entrants = somme des courants sortants (conservation de la charge).",
          "Loi des mailles : la somme algébrique des tensions le long d'une maille fermée est nulle.",
        ]},
        { t: "code", v: `Loi des nœuds :   Σ I_entrant = Σ I_sortant
Loi des mailles : Σ U = 0  (sur une boucle fermée)` },
      ]},
      { title: "Associations de résistances", blocks: [
        { t: "code", v: `En SÉRIE (même courant) :
   R_eq = R₁ + R₂ + R₃ + ...

En PARALLÈLE (même tension) :
   1/R_eq = 1/R₁ + 1/R₂ + ...
   (pour deux : R_eq = R₁R₂/(R₁+R₂))` },
        { t: "note", kind: "tip", title: "Mémo",
          v: "Série = on additionne les R. Parallèle = on additionne les 1/R. Le R_eq parallèle est toujours plus petit que la plus petite résistance." },
      ]},
      { title: "Schémas", blocks: [
        { t: "schema", name: "ohm", legend: "Loi d'Ohm : le générateur impose une tension, le courant I traverse la résistance R, et U = R·I." },
        { t: "schema", name: "mailles", legend: "Loi des mailles : sur une boucle fermée, la tension du générateur se répartit sur les résistances." },
        { t: "schema", name: "noeuds", legend: "Loi des nœuds : tout le courant qui entre dans un nœud en ressort (I = I₁ + I₂)." },
      ]},
    ],
  },
  {
    id: "e-div", subject: "elec", title: "Diviseur de tension & courant", sub: "ponts diviseurs · Thévenin",
    blurb: "La formule qui revient dans presque tous les exercices de circuits.",
    sections: [
      { title: "Diviseur de tension", blocks: [
        { t: "p", v: "Deux résistances en série soumises à une tension U : la tension se répartit proportionnellement aux résistances." },
        { t: "formula", tex: "U_2 = U \\cdot \\dfrac{R_2}{R_1 + R_2}", note: "Pont diviseur de tension : R₁ et R₂ en série, U₂ étant la tension aux bornes de R₂." },
        { t: "note", kind: "warn", title: "Condition",
          v: "Le diviseur de tension n'est valable que si aucun courant n'est tiré au point milieu (sortie « à vide ») ou si la charge est négligeable." },
      ]},
      { title: "Diviseur de courant", blocks: [
        { t: "code", v: `Deux résistances en parallèle, courant total I :

   I₁ = I · R₂ / (R₁ + R₂)

Le courant prend de préférence la plus petite
résistance.` },
      ]},
      { title: "Thévenin & Norton", blocks: [
        { t: "list", v: [
          "Tout dipôle linéaire se ramène à un générateur de tension E_th en série avec R_th (Thévenin).",
          "Ou à un générateur de courant I_n en parallèle avec R_n (Norton).",
          "R_th = R_n : résistance vue des bornes, sources éteintes (générateurs de tension court-circuités, de courant ouverts).",
        ]},
        { t: "note", kind: "tip", title: "Méthode",
          v: "Pour simplifier un circuit complexe : remplacer une partie par son équivalent Thévenin, puis appliquer le diviseur de tension." },
      ]},
      { title: "Schéma", blocks: [
        { t: "schema", name: "diviseur", legend: "Diviseur de tension : Vin alimente R₁ et R₂ en série, Vout est pris au point milieu, la masse en bas." },
      ]},
    ],
  },
  {
    id: "e-cl", subject: "elec", title: "Condensateur & bobine", sub: "charge · énergie · comportement",
    blurb: "Les deux composants réactifs : ils stockent de l'énergie et réagissent à la variation des signaux.",
    sections: [
      { title: "Le condensateur", blocks: [
        { t: "p", v: "Un condensateur stocke de l'énergie sous forme de charge électrique. La charge accumulée est proportionnelle à la tension à ses bornes." },
        { t: "formula", tex: [
          "Q = C \\cdot U \\qquad i = C\\,\\dfrac{dU}{dt}",
          "E = \\tfrac{1}{2}\\,C\\,U^{2}",
        ], note: "Condensateur : charge, courant et énergie stockée. C en farads (F)." },
        { t: "note", kind: "tip", title: "Idée clé",
          v: "Le condensateur s'oppose aux variations brusques de TENSION : sa tension ne peut pas sauter instantanément." },
      ]},
      { title: "La bobine", blocks: [
        { t: "p", v: "Une bobine (inductance) stocke de l'énergie sous forme magnétique. La tension à ses bornes dépend de la variation du courant." },
        { t: "formula", tex: [
          "U = L\\,\\dfrac{di}{dt}",
          "E = \\tfrac{1}{2}\\,L\\,I^{2}",
        ], note: "Bobine : tension et énergie stockée. L en henrys (H)." },
        { t: "note", kind: "tip", title: "Idée clé",
          v: "La bobine s'oppose aux variations brusques de COURANT : son courant ne peut pas sauter instantanément." },
      ]},
      { title: "Comportement selon la fréquence", blocks: [
        { t: "table", head: ["", "Basse fréquence", "Haute fréquence"], rows: [
          ["Condensateur", "Interrupteur ouvert", "Fil (court-circuit)"],
          ["Bobine", "Fil (court-circuit)", "Interrupteur ouvert"],
        ]},
        { t: "p", v: "En continu (fréquence nulle) : le condensateur bloque le courant, la bobine se comporte comme un simple fil." },
      ]},
      { title: "Régime transitoire (charge / décharge)", blocks: [
        { t: "p", v: "Quand on alimente un circuit RC ou RL, la grandeur évolue exponentiellement vers sa valeur finale avec une constante de temps τ." },
        { t: "formula", tex: [
          "\\tau = R\\,C \\quad\\text{(RC)} \\qquad \\tau = \\dfrac{L}{R} \\quad\\text{(RL)}",
          "u(t) = E\\left(1 - e^{-t/\\tau}\\right) \\qquad u(t) = E\\,e^{-t/\\tau}",
        ], note: "Constante de temps, puis lois de charge et de décharge." },
        { t: "note", kind: "info", title: "Repère",
          v: "Après une durée de 5τ, le régime transitoire est terminé : on est en régime permanent." },
      ]},
    ],
  },
  {
    id: "e-sinus", subject: "elec", title: "Régime sinusoïdal", sub: "impédances · déphasage",
    blurb: "Étudier les circuits alimentés par une tension alternative sinusoïdale.",
    sections: [
      { title: "Grandeurs sinusoïdales", blocks: [
        { t: "code", v: `u(t) = U_max · cos(ω t + φ)

ω = 2π f   : pulsation (rad/s)
f          : fréquence (Hz)
φ          : phase à l'origine
U_eff = U_max / √2  : valeur efficace` },
      ]},
      { title: "Condensateur et bobine", blocks: [
        { t: "code", v: `Condensateur : charge Q = C·U,  i = C·dU/dt
Bobine :       U = L·dI/dt

Énergie : condensateur ½CU²,  bobine ½LI²` },
        { t: "note", kind: "info", title: "Comportement limite",
          v: "À basse fréquence : la bobine est un fil, le condensateur un interrupteur ouvert. À haute fréquence : l'inverse." },
      ]},
      { title: "Impédances complexes", blocks: [
        { t: "p", v: "En régime sinusoïdal, chaque composant a une impédance complexe Z. La loi d'Ohm devient U = Z·I." },
        { t: "formula", tex: "Z_R = R \\qquad Z_L = jL\\omega \\qquad Z_C = \\dfrac{1}{jC\\omega}", note: "Impédances complexes : |Z| est le rapport des amplitudes, arg(Z) le déphasage tension/courant." },
      ]},
      { title: "Associations en complexe", blocks: [
        { t: "p", v: "Les impédances s'associent comme les résistances : en série on additionne les Z, en parallèle on additionne les 1/Z. Le diviseur de tension reste valable avec les Z." },
      ]},
      { title: "Exemple guidé — impédance d'un condensateur", blocks: [
        { t: "p", v: "On veut le module de l'impédance d'un condensateur C = 1 µF à la fréquence f = 1 kHz." },
        { t: "list", v: [
          "Écrire l'impédance complexe : Z_C = 1/(jCω).",
          "Passer la pulsation : ω = 2πf.",
          "Prendre le module : |Z_C| = 1/(Cω).",
          "Application numérique.",
        ]},
        { t: "formula", tex: "|Z_C| = \\dfrac{1}{C\\,\\omega} = \\dfrac{1}{C\\cdot 2\\pi f}", note: "Le module ne garde que l'amplitude ; l'argument donnerait le déphasage." },
        { t: "code", v: `ω = 2π × 1000 ≈ 6283 rad/s
|Z_C| = 1 / (10⁻⁶ × 6283) ≈ 159 Ω` },
      ]},
      { title: "Méthode type TD/TP", blocks: [
        { t: "list", v: [
          "Repérer si on est en régime sinusoïdal → passer en impédances complexes.",
          "Remplacer R, L, C par Z_R, Z_L, Z_C.",
          "Appliquer les mêmes lois qu'en continu (mailles, nœuds, diviseur).",
          "Module = amplitude, argument = déphasage.",
        ]},
        { t: "note", kind: "warn", title: "Erreur fréquente",
          v: "Traiter une bobine ou un condensateur comme une résistance constante : leur impédance dépend de la fréquence." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "Une bobine L = 10 mH est parcourue par un signal à f = 50 Hz. Calcule le module de son impédance Z_L." },
        { t: "note", kind: "tip", title: "Solution",
          v: "|Z_L| = Lω = L·2πf = 0,01 × 2π × 50 ≈ 3,14 Ω." },
      ]},
    ],
  },
  {
    id: "e-filtre", subject: "elec", title: "Filtres & diagramme de Bode", sub: "passe-bas · passe-haut",
    blurb: "Des circuits qui laissent passer certaines fréquences et en bloquent d'autres.",
    sections: [
      { title: "Fonction de transfert", blocks: [
        { t: "formula", tex: [
          "H(j\\omega) = \\dfrac{U_{\\text{sortie}}}{U_{\\text{entr\u00e9e}}}",
          "G = |H| \\qquad G_{\\text{dB}} = 20\\,\\log_{10}|H| \\qquad \\varphi = \\arg(H)",
        ], note: "Fonction de transfert, gain (lin\u00e9aire et en d\u00e9cibels) et d\u00e9phasage." },
      ]},
      { title: "Filtre RC passe-bas", blocks: [
        { t: "p", v: "Un circuit R en série, sortie aux bornes de C : laisse passer les basses fréquences, atténue les hautes." },
        { t: "formula", tex: [
          "H(j\\omega) = \\dfrac{1}{1 + jRC\\omega}",
          "\\omega_c = \\dfrac{1}{RC} \\qquad f_c = \\dfrac{1}{2\\pi RC}",
        ], note: "Filtre passe-bas RC : à la coupure, le gain vaut 1/√2, soit −3 dB." },
        { t: "note", kind: "tip", title: "Reconnaître",
          v: "Passe-bas : le gain part de 1 (0 dB) et chute après ω_c, à −20 dB/décade." },
      ]},
      { title: "Filtre RC passe-haut", blocks: [
        { t: "code", v: `Passe-haut RC (sortie aux bornes de R) :
   H(jω) = jRCω / (1 + jRCω)
   gain nul en basse fréq, → 1 en haute fréq.` },
      ]},
      { title: "Lecture d'un diagramme de Bode", blocks: [
        { t: "list", v: [
          "Repérer la fréquence de coupure : là où le gain vaut −3 dB.",
          "Pente −20 dB/décade : filtre d'ordre 1. −40 dB/décade : ordre 2.",
          "Gain plat puis chute → passe-bas ; chute puis plat → passe-haut ; bosse → passe-bande.",
        ]},
      ]},
      { title: "Passe-bande & coupe-bande", blocks: [
        { t: "p", v: "Un passe-bande laisse passer une plage de fréquences entre deux coupures ; un coupe-bande (réjecteur) en bloque une au contraire." },
        { t: "table", head: ["Filtre", "Allure du gain", "Laisse passer"], rows: [
          ["Passe-bande", "Bosse, plat au sommet", "Une bande de fréquences"],
          ["Coupe-bande", "Creux marqué", "Tout sauf une bande"],
        ]},
        { t: "code", v: `Passe-bande : deux fréquences de coupure
   f₁ (basse) et f₂ (haute), toutes deux à −3 dB

Bande passante :  Δf = f₂ − f₁
Fréquence centrale : f₀ = √(f₁·f₂)` },
        { t: "note", kind: "tip", title: "Reconnaître vite",
          v: "Une bosse = passe-bande, un creux = coupe-bande. La largeur de la bosse/creux donne la bande passante." },
      ]},
      { title: "Exemple guidé — filtre passe-bas RC", blocks: [
        { t: "p", v: "Un filtre passe-bas RC a R = 1 kΩ et C = 100 nF. On cherche sa fréquence de coupure, puis son gain en décibels à très haute fréquence (une décade au-dessus de f_c)." },
        { t: "list", v: [
          "Identifier le type : R en série, sortie sur C → passe-bas.",
          "Calculer la fréquence de coupure f_c = 1/(2πRC).",
          "Au-delà de f_c, le gain chute de −20 dB par décade (ordre 1).",
        ]},
        { t: "formula", tex: "f_c = \\dfrac{1}{2\\pi RC}", note: "Filtre du 1er ordre : pente de −20 dB/décade après la coupure." },
        { t: "code", v: `f_c = 1 / (2π × 1000 × 100·10⁻⁹) ≈ 1592 Hz

À 10 × f_c (une décade plus haut) :
gain ≈ 0 dB − 20 dB = −20 dB` },
      ]},
      { title: "Méthode type TD/TP", blocks: [
        { t: "list", v: [
          "Établir la fonction de transfert H(jω).",
          "Comportement en BF et HF → type de filtre.",
          "Coupure : poser RCω = 1.",
          "Tracer le gain (asymptotes) et la phase.",
        ]},
        { t: "note", kind: "warn", title: "Erreur fréquente",
          v: "Confondre passe-bas et passe-haut : vérifier où est prise la sortie (sur C → passe-bas, sur R → passe-haut)." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "Un filtre passe-bas RC a R = 2 kΩ et C = 1 µF. Calcule sa fréquence de coupure f_c." },
        { t: "note", kind: "tip", title: "Solution",
          v: "f_c = 1/(2πRC) = 1/(2π × 2000 × 10⁻⁶) ≈ 80 Hz." },
      ]},
      { title: "Astuces de révision", blocks: [
        { t: "note", kind: "tip", title: "Identifier un filtre vite",
          v: "Regarde le comportement aux extrêmes : ce qui passe en BF / en HF donne le type. La coupure se lit à −3 dB sur la courbe de GAIN." },
        { t: "note", kind: "tip", title: "Mémo passe-bas / passe-haut",
          v: "Sortie aux bornes de C → passe-bas. Sortie aux bornes de R → passe-haut. Pente −20 dB/décade = ordre 1, −40 = ordre 2." },
      ]},
      { title: "Schémas des filtres", blocks: [
        { t: "schema", name: "rc-passebas", legend: "Passe-bas RC : R en série, C vers la masse, sortie aux bornes de C." },
        { t: "schema", name: "rc-passehaut", legend: "Passe-haut RC : C en série, R vers la masse, sortie aux bornes de R." },
        { t: "schema", name: "bode-passebande", legend: "Allure d'un passe-bande : une bosse de gain entre deux fréquences de coupure." },
        { t: "schema", name: "bode-coupebande", legend: "Allure d'un coupe-bande : un creux de gain autour de la fréquence centrale f₀." },
      ]},
    ],
  },
  {
    id: "e-aop", subject: "elec", title: "Amplificateur opérationnel", sub: "AOP idéal · montages",
    blurb: "Le composant actif star de l'électronique : amplifie, compare, filtre.",
    sections: [
      { title: "L'AOP idéal", blocks: [
        { t: "list", v: [
          "Impédances d'entrée infinies : aucun courant n'entre dans les bornes + et − (i⁺ = i⁻ = 0).",
          "Gain infini en boucle ouverte.",
          "En régime linéaire (avec rétroaction sur l'entrée −) : V⁺ = V⁻.",
        ]},
        { t: "note", kind: "warn", title: "Condition du régime linéaire",
          v: "V⁺ = V⁻ n'est valable que si l'AOP a une contre-réaction sur l'entrée inverseuse (−). Sinon il sature (comparateur)." },
      ]},
      { title: "Montages de base", blocks: [
        { t: "formula", tex: [
          "\\text{Non inverseur :}\\quad V_s = \\left(1 + \\dfrac{R_2}{R_1}\\right) V_e",
          "\\text{Inverseur :}\\quad V_s = -\\dfrac{R_2}{R_1}\\,V_e",
          "\\text{Suiveur :}\\quad V_s = V_e",
        ], note: "Gains des montages AOP de base (le suiveur sert d'adaptateur d'impédance)." },
      ]},
      { title: "Méthode d'analyse d'un montage AOP", blocks: [
        { t: "list", v: [
          "Vérifier la rétroaction : si elle arrive sur l'entrée −, régime linéaire (V⁺ = V⁻).",
          "Écrire i⁺ = i⁻ = 0 (aucun courant dans l'AOP).",
          "Appliquer la loi des nœuds aux bornes + et −.",
          "Utiliser le diviseur de tension là où c'est possible.",
        ]},
      ]},
      { title: "Saturation & comparateur", blocks: [
        { t: "p", v: "Si la rétroaction arrive sur l'entrée + (ou s'il n'y en a pas), l'AOP n'est PLUS linéaire : il sature. La sortie ne peut que valoir +Vsat ou −Vsat (proches des tensions d'alimentation)." },
        { t: "code", v: `Régime saturé :
   V⁺ > V⁻   →   Vs = +Vsat
   V⁺ < V⁻   →   Vs = −Vsat

(on n'écrit PAS V⁺ = V⁻ en régime saturé)` },
        { t: "p", v: "Même en régime linéaire, si le calcul donne |Vs| supérieur à Vsat, la sortie est écrêtée à ±Vsat : c'est la saturation." },
      ]},
      { title: "Trigger de Schmitt", blocks: [
        { t: "p", v: "Le trigger de Schmitt est un comparateur à hystérésis : la rétroaction est sur l'entrée +, et il possède DEUX seuils de basculement distincts (seuil haut et seuil bas)." },
        { t: "list", v: [
          "La sortie bascule entre +Vsat et −Vsat.",
          "Le seuil de basculement dépend de l'état courant de la sortie.",
          "L'écart entre les deux seuils est la largeur d'hystérésis.",
        ]},
        { t: "note", kind: "tip", title: "À quoi ça sert",
          v: "L'hystérésis évite les basculements parasites quand le signal d'entrée est bruité autour du seuil : on l'utilise pour mettre en forme un signal." },
      ]},
      { title: "Exemple guidé — montage inverseur", blocks: [
        { t: "p", v: "Un AOP idéal est monté en inverseur avec R₁ = 1 kΩ (entrée) et R₂ = 22 kΩ (contre-réaction), alimenté en ±15 V. On applique Ve = −0,4 V. Calculer Vs." },
        { t: "list", v: [
          "Vérifier la contre-réaction sur l'entrée − → régime linéaire.",
          "Appliquer la formule du gain inverseur.",
          "Vérifier que |Vs| reste sous la tension de saturation.",
        ]},
        { t: "formula", tex: "V_s = -\\dfrac{R_2}{R_1}\\,V_e", note: "Montage inverseur : la sortie est en opposition de phase avec l'entrée." },
        { t: "code", v: `gain = −R₂/R₁ = −22
Vs = −22 × (−0,4) = +8,8 V
8,8 V < 15 V → régime linéaire, pas de saturation` },
      ]},
      { title: "Exemple guidé — saturation de l'AOP", blocks: [
        { t: "p", v: "Un AOP alimenté en ±12 V est monté en comparateur (aucune contre-réaction sur l'entrée −). On applique V⁺ = 1 V et V⁻ = 0 V. Que vaut la sortie Vs ?" },
        { t: "list", v: [
          "Vérifier la contre-réaction : il n'y en a pas sur l'entrée − → régime SATURÉ.",
          "En saturation, la sortie ne dépend que du SIGNE de (V⁺ − V⁻).",
          "Ici V⁺ − V⁻ = 1 − 0 = 1 > 0 → saturation HAUTE.",
        ]},
        { t: "formula", tex: "V^{+} > V^{-} \\Rightarrow V_s = +V_{\\text{sat}} \\qquad V^{+} < V^{-} \\Rightarrow V_s = -V_{\\text{sat}}", note: "En régime saturé, la sortie est collée à +Vsat ou −Vsat." },
        { t: "code", v: `V⁺ − V⁻ = +1 V > 0
→ Vs = +Vsat ≈ +12 V` },
        { t: "note", kind: "warn", title: "Erreur fréquente",
          v: "Écrire V⁺ = V⁻ en saturation : cette relation n'est valable QU'EN régime linéaire (contre-réaction sur −)." },
      ]},
      { title: "Mini-exercice — saturation", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "Même comparateur alimenté en ±12 V. On applique V⁺ = −2 V et V⁻ = 0 V. Que vaut Vs ?" },
        { t: "note", kind: "tip", title: "Correction",
          v: "V⁺ − V⁻ = −2 < 0 → saturation basse : Vs = −Vsat ≈ −12 V." },
      ]},
      { title: "Méthode type TD/TP", blocks: [
        { t: "list", v: [
          "Repérer l'entrée sur laquelle revient la contre-réaction.",
          "Sur l'entrée − : régime linéaire, poser i⁺ = i⁻ = 0 et V⁺ = V⁻.",
          "Loi des nœuds aux bornes + et −, ou diviseur de tension.",
          "Vérifier à la fin que |Vs| ≤ Vsat (sinon : saturation).",
        ]},
        { t: "note", kind: "warn", title: "Erreur fréquente",
          v: "Écrire V⁺ = V⁻ sans contre-réaction sur l'entrée − : l'AOP est alors saturé, la relation est fausse." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "Un AOP idéal est monté en non-inverseur avec R₁ = 1 kΩ et R₂ = 4 kΩ. On applique Ve = 2 V. Calcule Vs." },
        { t: "note", kind: "tip", title: "Solution",
          v: "Vs = (1 + R₂/R₁)·Ve = (1 + 4)×2 = 10 V." },
      ]},
      { title: "Astuces de révision", blocks: [
        { t: "note", kind: "tip", title: "Le réflexe AOP",
          v: "Regarde toujours OÙ revient la contre-réaction. Sur l'entrée − → régime linéaire (V⁺ = V⁻). Sinon → saturé, la sortie vaut +Vsat ou −Vsat." },
        { t: "note", kind: "tip", title: "Retenir les gains",
          v: "Inverseur : gain = −R₂/R₁ (signe moins). Non-inverseur : gain = 1 + R₂/R₁ (toujours ≥ 1). Trigger de Schmitt = comparateur à hystérésis : deux seuils, utile contre le bruit." },
      ]},
      { title: "Schémas des montages AOP", blocks: [
        { t: "schema", name: "aop-ideal", legend: "AOP idéal : entrée + (V⁺), entrée − (V⁻), sortie Vs. Aucun courant n'entre dans les entrées." },
        { t: "schema", name: "aop-inverseur", legend: "Inverseur : Ve arrive par R₁ sur l'entrée −, R₂ assure la contre-réaction, l'entrée + est à la masse." },
        { t: "schema", name: "aop-noninverseur", legend: "Non-inverseur : Ve sur l'entrée +, le pont R₁/R₂ ramène une partie de la sortie sur l'entrée −." },
        { t: "schema", name: "aop-suiveur", legend: "Suiveur : la sortie est reliée directement à l'entrée −, donc Vs = Ve." },
        { t: "schema", name: "aop-comparateur", legend: "Comparateur : aucune contre-réaction → la sortie est saturée à +Vsat ou −Vsat." },
        { t: "schema", name: "aop-schmitt", legend: "Trigger de Schmitt : la contre-réaction revient sur l'entrée + → hystérésis à deux seuils." },
      ]},
    ],
  },
  {
    id: "e-methode", subject: "elec", title: "Méthode TP / TD", sub: "lire une courbe · justifier",
    blurb: "Comment aborder un TP ou un TD d'électronique : lecture de courbes, identification, justification.",
    sections: [
      { title: "Lire une courbe", blocks: [
        { t: "list", v: [
          "Identifier les axes : que représentent l'abscisse et l'ordonnée, avec quelles unités ?",
          "Repérer les points remarquables : valeur initiale, valeur finale, maximum, pente.",
          "Sur un oscilloscope : lire l'amplitude (axe vertical) et la période (axe horizontal), en déduire la fréquence f = 1/T.",
          "Sur un Bode : repérer le gain en basses et hautes fréquences, et la fréquence de coupure (−3 dB).",
        ]},
      ]},
      { title: "Identifier un filtre", blocks: [
        { t: "table", head: ["Allure du gain", "Filtre"], rows: [
          ["Plat puis chute", "Passe-bas"],
          ["Chute puis plat", "Passe-haut"],
          ["Bosse autour d'une fréquence", "Passe-bande"],
          ["Creux autour d'une fréquence", "Coupe-bande / réjecteur"],
        ]},
        { t: "p", v: "La pente après coupure donne l'ordre : −20 dB/décade par ordre." },
      ]},
      { title: "Utiliser une formule correctement", blocks: [
        { t: "list", v: [
          "Vérifier les unités AVANT le calcul (10 kΩ = 10⁴ Ω, 100 nF = 10⁻⁷ F).",
          "Vérifier l'homogénéité du résultat (RC a la dimension d'un temps).",
          "Donner le résultat avec une unité et un nombre de chiffres significatifs raisonnable.",
        ]},
      ]},
      { title: "Justifier une réponse", blocks: [
        { t: "list", v: [
          "Citer la loi utilisée (Ohm, Kirchhoff, diviseur de tension…).",
          "Écrire l'équation littérale avant l'application numérique.",
          "Conclure par une phrase qui répond à la question posée.",
        ]},
        { t: "note", kind: "tip", title: "En TP",
          v: "Comparer la mesure à la valeur théorique : un écart est normal, mais il faut pouvoir l'expliquer (tolérance des composants, résistance interne, charge)." },
      ]},
    ],
  },
  {
    id: "e-bode", subject: "elec", title: "Lire une courbe de Bode", sub: "gain · phase · −3 dB · ordre",
    blurb: "La méthode complète pour décoder un diagramme de Bode en examen.",
    sections: [
      { title: "Les deux courbes", blocks: [
        { t: "p", v: "Un diagramme de Bode est composé de DEUX graphiques superposés, avec la même échelle de fréquence (logarithmique) en abscisse." },
        { t: "list", v: [
          "Courbe du GAIN : en ordonnée, le gain en décibels G_dB = 20·log₁₀(|H|).",
          "Courbe de la PHASE : en ordonnée, le déphasage φ = arg(H), en degrés.",
        ]},
        { t: "note", kind: "warn", title: "Erreur classique",
          v: "La fréquence de coupure se lit sur la courbe du GAIN, jamais sur celle de la phase. Ne pas confondre les deux graphiques." },
      ]},
      { title: "Où lire le gain", blocks: [
        { t: "p", v: "On regarde la courbe du gain aux deux extrémités (basses et hautes fréquences) : ce sont les zones où la courbe est plate (asymptotes)." },
        { t: "code", v: `Gain à 0 dB     →  signal transmis sans atténuation
Gain négatif    →  signal atténué
Gain positif    →  signal amplifié (ex : AOP)` },
      ]},
      { title: "Où lire la phase", blocks: [
        { t: "p", v: "La courbe de phase indique le déphasage entre la sortie et l'entrée." },
        { t: "code", v: `Passe-bas ordre 1 : phase de 0° → −90°
Passe-haut ordre 1 : phase de +90° → 0°
À la coupure : phase = ±45°` },
      ]},
      { title: "Trouver la fréquence de coupure (−3 dB)", blocks: [
        { t: "list", v: [
          "Repérer la valeur du gain dans la bande passante (souvent 0 dB).",
          "Descendre de 3 dB sous cette valeur.",
          "La fréquence correspondante sur la courbe du gain est la fréquence de coupure f_c.",
        ]},
        { t: "note", kind: "info", title: "Pourquoi −3 dB",
          v: "À la coupure, le gain vaut |H| = 1/√2 du gain maximal. Or 20·log₁₀(1/√2) ≈ −3 dB." },
      ]},
      { title: "Reconnaître le type de filtre", blocks: [
        { t: "table", head: ["Allure du gain", "Filtre"], rows: [
          ["Plat puis chute", "Passe-bas"],
          ["Monte puis plat", "Passe-haut"],
          ["Bosse, plat au milieu", "Passe-bande"],
          ["Creux au milieu", "Coupe-bande (réjecteur)"],
        ]},
      ]},
      { title: "Ordre du filtre & bande passante", blocks: [
        { t: "p", v: "L'ordre se lit sur la PENTE de la courbe du gain après la coupure." },
        { t: "formula", tex: [
          "-20\\ \\text{dB/décade} \\to \\text{ordre 1} \\qquad -20n\\ \\text{dB/décade} \\to \\text{ordre } n",
          "\\Delta f = f_c^{\\text{haute}} - f_c^{\\text{basse}}",
        ], note: "L'ordre se lit sur la pente ; la bande passante est l'écart entre les deux coupures à −3 dB." },
        { t: "note", kind: "tip", title: "Méthode express",
          v: "1) Type ? (allure plate/chute). 2) Coupure ? (−3 dB). 3) Ordre ? (pente). 4) Bande passante ? (écart des coupures)." },
      ]},
      { title: "Exemple guidé — lire un Bode", blocks: [
        { t: "p", v: "Un diagramme de Bode montre un gain constant à 0 dB jusqu'à 2 kHz, puis une chute régulière de −40 dB par décade. On identifie le filtre, son ordre et sa coupure." },
        { t: "list", v: [
          "Gain plat puis chute → filtre passe-bas.",
          "Pente −40 dB/décade → ordre 2.",
          "La chute commence à 2 kHz → f_c = 2 kHz (−3 dB).",
          "À 20 kHz (une décade plus loin) : gain ≈ −40 dB.",
        ]},
        { t: "note", kind: "tip", title: "Lecture en ordre",
          v: "Type (allure) → ordre (pente) → coupure (−3 dB) → extrapolation du gain avec la pente." },
      ]},
      { title: "Lecture de courbes en TP", blocks: [
        { t: "list", v: [
          "Sur l'oscilloscope : mesurer l'amplitude d'entrée et de sortie pour chaque fréquence.",
          "Gain = Vs/Ve, puis G_dB = 20·log₁₀(Vs/Ve).",
          "Le déphasage se lit sur le décalage temporel entre les deux courbes.",
          "Reporter les points (fréquence, gain) pour tracer le Bode expérimental.",
        ]},
        { t: "note", kind: "warn", title: "Erreur fréquente",
          v: "Lire la fréquence de coupure sur la courbe de phase : elle se lit sur la courbe de GAIN, à −3 dB." },
      ]},
      { title: "Mini-exercice", blocks: [
        { t: "note", kind: "info", title: "À toi de jouer",
          v: "Sur un Bode, le gain est plat à 0 dB en hautes fréquences et chute quand la fréquence baisse, avec une pente de −20 dB/décade. Quel type et quel ordre de filtre ?" },
        { t: "note", kind: "tip", title: "Solution",
          v: "Hautes fréquences qui passent → passe-haut. Pente −20 dB/décade → ordre 1." },
      ]},
      { title: "Astuces de révision", blocks: [
        { t: "note", kind: "tip", title: "Lire un Bode en 4 réflexes",
          v: "1) Type : allure plate puis chute. 2) Coupure : −3 dB. 3) Ordre : pente (−20n dB/décade). 4) Bande passante : écart des coupures." },
        { t: "note", kind: "tip", title: "Le piège de la phase",
          v: "La phase confirme le type (passe-bas ordre 1 : 0° → −90°) mais ne sert jamais à lire f_c : la coupure se lit sur la courbe de gain." },
      ]},
      { title: "Schémas de Bode", blocks: [
        { t: "schema", name: "bode-passebas", legend: "Gain d'un passe-bas : plat à 0 dB, puis chute de −20 dB/décade après f_c. La coupure se lit à −3 dB." },
        { t: "schema", name: "bode-passehaut", legend: "Gain d'un passe-haut : monte de +20 dB/décade, puis devient plat après f_c (−3 dB à la coupure)." },
      ]},
    ],
  },
];

/* ================== AGRÉGAT DE TOUTES LES FICHES ================== */

const ALL_FICHES = [...FICHES_INFO, ...FICHES_MATH, ...FICHES_MECA, ...FICHES_ELEC];

function fichesOf(subjectId) {
  return ALL_FICHES.filter((f) => f.subject === subjectId);
}

/* ================== FLASHCARDS ================== */

const FLASHCARDS = [
  /* --- INFORMATIQUE --- */
  { id: "fi1", subject: "info", chapter: "Pointeurs", type: "def", front: "Qu'est-ce qu'un pointeur ?", back: "Une variable dont la valeur est l'adresse mémoire d'une autre variable." },
  { id: "fi2", subject: "info", chapter: "Pointeurs", type: "def", front: "Que font les opérateurs & et * ?", back: "&x donne l'adresse de x ; *p donne la valeur stockée à l'adresse p. Ils sont inverses." },
  { id: "fi3", subject: "info", chapter: "Pointeurs", type: "piege", front: "Pourquoi scanf prend &n ?", back: "scanf doit ÉCRIRE dans n : on lui passe l'adresse de n (passage par adresse)." },
  { id: "fi4", subject: "info", chapter: "Pointeurs", type: "def", front: "À quoi sert un void* ?", back: "Pointeur générique : il pointe n'importe quel type. Sert aux librairies génériques. Cast obligatoire pour l'utiliser." },
  { id: "fi5", subject: "info", chapter: "Allocation", type: "def", front: "Que retourne malloc en cas d'échec ?", back: "NULL. Il faut TOUJOURS tester le retour de malloc avant de l'utiliser." },
  { id: "fi6", subject: "info", chapter: "Allocation", type: "def", front: "Différence malloc / calloc ?", back: "calloc initialise la mémoire à zéro ; malloc laisse des valeurs indéterminées." },
  { id: "fi7", subject: "info", chapter: "Allocation", type: "methode", front: "Schéma d'une chaîne dynamique ?", back: "fgets dans un buffer → strcspn retire le \\n → malloc(strlen+1) → strcpy." },
  { id: "fi8", subject: "info", chapter: "Allocation", type: "piege", front: "Ordre de libération d'une struct à champ dynamique ?", back: "D'abord le champ (free(p->nom)), PUIS la struct (free(p)). L'inverse perd l'adresse." },
  { id: "fi9", subject: "info", chapter: "Structures", type: "def", front: "Quand utiliser . et -> ?", back: ". sur une variable struct ; -> sur un pointeur sur struct. p->x équivaut à (*p).x." },
  { id: "fi10", subject: "info", chapter: "Listes", type: "piege", front: "Erreur classique en parcourant une liste ?", back: "Faire avancer l'ancre tete elle-même : on perd le début. On parcourt avec une copie." },
  { id: "fi11", subject: "info", chapter: "Listes", type: "methode", front: "Comment libérer une liste chaînée ?", back: "Maillon par maillon, en sauvegardant l'adresse du suivant AVANT le free." },
  { id: "fi12", subject: "info", chapter: "Piles & Files", type: "def", front: "FIFO vs LIFO ?", back: "File = FIFO (premier entré, premier sorti). Pile = LIFO (dernier entré, premier sorti)." },
  { id: "fi13", subject: "info", chapter: "Piles & Files", type: "methode", front: "Comment inverser une file ?", back: "La vider dans une pile (qui inverse l'ordre), puis reverser la pile dans la file." },
  { id: "fi14", subject: "info", chapter: "Récursivité", type: "def", front: "Que doit avoir tout algo récursif ?", back: "Un cas de base atteignable, sinon récursion infinie → débordement de pile." },
  { id: "fi15", subject: "info", chapter: "Récursivité", type: "formule", front: "Définition récursive de n! ?", back: "0! = 1 (cas de base) ; n! = n × (n-1)! (cas récursif)." },
  { id: "fi16", subject: "info", chapter: "Fichiers", type: "piege", front: "Que fait le mode \"w\" de fopen ?", back: "Il CRÉE ou ÉCRASE le fichier. Pour ajouter à la fin, utiliser le mode \"a\"." },
  { id: "fi17", subject: "info", chapter: "Allegro", type: "def", front: "À quoi sert le double buffering ?", back: "Dessiner tout sur un buffer puis le copier d'un coup : évite les clignotements." },

  /* --- MATHÉMATIQUES --- */
  { id: "fm1", subject: "math", chapter: "DL", type: "formule", front: "DL de eˣ en 0 ?", back: "eˣ = 1 + x + x²/2! + x³/3! + ... + xⁿ/n! + o(xⁿ)" },
  { id: "fm2", subject: "math", chapter: "DL", type: "formule", front: "DL de ln(1+x) en 0 ?", back: "ln(1+x) = x − x²/2 + x³/3 − ... + (−1)ⁿ⁻¹ xⁿ/n + o(xⁿ)" },
  { id: "fm3", subject: "math", chapter: "DL", type: "formule", front: "DL de sin(x) et cos(x) en 0 ?", back: "sin(x) = x − x³/3! + x⁵/5! − ... ; cos(x) = 1 − x²/2! + x⁴/4! − ..." },
  { id: "fm4", subject: "math", chapter: "DL", type: "methode", front: "Comment calculer une limite avec un DL ?", back: "Remplacer numérateur et dénominateur par leur équivalent (1er terme non nul du DL)." },
  { id: "fm5", subject: "math", chapter: "DL", type: "piege", front: "Erreur classique sur les DL ?", back: "Confondre les débuts : sin commence par x, cos par 1, ln(1+x) par x." },
  { id: "fm6", subject: "math", chapter: "Intégrales", type: "formule", front: "Quand ∫₁^∞ dx/xᵅ converge-t-elle ?", back: "Si et seulement si α > 1 (à l'infini, il faut décroître vite)." },
  { id: "fm7", subject: "math", chapter: "Intégrales", type: "formule", front: "Quand ∫₀¹ dx/xᵝ converge-t-elle ?", back: "Si et seulement si β < 1 (en 0, il faut exploser lentement)." },
  { id: "fm8", subject: "math", chapter: "Intégrales", type: "methode", front: "Méthode pour la nature d'une intégrale ?", back: "Trouver un équivalent simple de f en la borne, puis comparer à une intégrale de Riemann." },
  { id: "fm9", subject: "math", chapter: "Intégrales", type: "def", front: "Convergence absolue ?", back: "∫f converge absolument si ∫|f| converge. Convergence absolue ⟹ convergence." },
  { id: "fm10", subject: "math", chapter: "Matrices", type: "piege", front: "AB = BA ?", back: "Non ! Le produit matriciel n'est pas commutatif en général." },
  { id: "fm11", subject: "math", chapter: "Matrices", type: "formule", front: "Inverse d'une matrice 2×2 [[a,b],[c,d]] ?", back: "A⁻¹ = 1/(ad−bc) × [[d,−b],[−c,a]], si ad−bc ≠ 0." },
  { id: "fm12", subject: "math", chapter: "Matrices", type: "methode", front: "Résoudre AX = B ?", back: "Méthode de l'inverse (X = A⁻¹B si A inversible) ou méthode de Gauss (échelonnement)." },
  { id: "fm13", subject: "math", chapter: "Déterminants", type: "formule", front: "Déterminant 2×2 ?", back: "det [[a,b],[c,d]] = ad − bc." },
  { id: "fm14", subject: "math", chapter: "Déterminants", type: "def", front: "Lien déterminant / inversibilité ?", back: "A est inversible ⟺ det(A) ≠ 0. Si det = 0, pas de solution unique pour AX = B." },
  { id: "fm15", subject: "math", chapter: "Déterminants", type: "piege", front: "Quand un déterminant est-il nul ?", back: "Ligne (ou colonne) nulle, ou deux lignes proportionnelles." },

  /* --- MÉCANIQUE --- */
  { id: "fc1", subject: "meca", chapter: "Travail", type: "formule", front: "Travail d'une force constante ?", back: "W = F⃗ · AB⃗ = F·AB·cos(θ). Travail élémentaire : δW = F⃗·dl⃗." },
  { id: "fc2", subject: "meca", chapter: "Travail", type: "formule", front: "Puissance d'une force ?", back: "P = δW/dt = F⃗ · v⃗. Unité : le watt (W)." },
  { id: "fc3", subject: "meca", chapter: "Énergie cinétique", type: "formule", front: "Théorème de l'énergie cinétique ?", back: "ΔEc = Σ W(forces extérieures), avec Ec = ½mv²." },
  { id: "fc4", subject: "meca", chapter: "Énergie potentielle", type: "def", front: "Force conservative ?", back: "Force dont le travail ne dépend que des points de départ et d'arrivée, pas du chemin." },
  { id: "fc5", subject: "meca", chapter: "Énergie potentielle", type: "formule", front: "Ep de pesanteur et de ressort ?", back: "Ep(pesanteur) = mgz ; Ep(ressort) = ½kx²." },
  { id: "fc6", subject: "meca", chapter: "Énergie potentielle", type: "def", front: "Équilibre stable vs instable ?", back: "Stable = minimum de Ep (puits) ; instable = maximum de Ep." },
  { id: "fc7", subject: "meca", chapter: "Énergie mécanique", type: "formule", front: "Théorème de l'énergie mécanique ?", back: "ΔEm = W(forces non conservatives), avec Em = Ec + Ep." },
  { id: "fc8", subject: "meca", chapter: "Énergie mécanique", type: "def", front: "Quand Em est-elle conservée ?", back: "Quand il n'y a pas de force non conservative (pas de frottements) : Em = constante." },
  { id: "fc9", subject: "meca", chapter: "Oscillateur", type: "formule", front: "Équation de l'oscillateur harmonique ?", back: "ẍ + ω₀²x = 0 ; solution x(t) = A·cos(ω₀t + φ)." },
  { id: "fc10", subject: "meca", chapter: "Oscillateur", type: "formule", front: "Pulsation propre masse-ressort et pendule ?", back: "Masse-ressort : ω₀ = √(k/m). Pendule : ω₀ = √(g/L)." },
  { id: "fc11", subject: "meca", chapter: "Oscillateur", type: "formule", front: "Ressorts en série / parallèle ?", back: "Parallèle : k_eq = k₁+k₂. Série : 1/k_eq = 1/k₁ + 1/k₂." },
  { id: "fc12", subject: "meca", chapter: "Amortissement", type: "def", front: "Les trois régimes d'un oscillateur amorti ?", back: "Pseudo-périodique (Q>1/2), critique (Q=1/2), apériodique (Q<1/2)." },
  { id: "fc13", subject: "meca", chapter: "Amortissement", type: "methode", front: "Reconnaître le régime sur une courbe ?", back: "Oscille en s'atténuant = pseudo-périodique. Revient sans osciller = critique/apériodique." },

  /* --- ÉLECTRONIQUE --- */
  { id: "fe1", subject: "elec", chapter: "Lois", type: "formule", front: "Loi d'Ohm ?", back: "U = R·I. La tension est proportionnelle au courant à travers une résistance." },
  { id: "fe2", subject: "elec", chapter: "Lois", type: "def", front: "Lois de Kirchhoff ?", back: "Loi des nœuds : Σ courants entrants = Σ sortants. Loi des mailles : Σ tensions = 0." },
  { id: "fe3", subject: "elec", chapter: "Lois", type: "formule", front: "Résistances en série / parallèle ?", back: "Série : R_eq = R₁+R₂. Parallèle : 1/R_eq = 1/R₁ + 1/R₂." },
  { id: "fe4", subject: "elec", chapter: "Diviseur", type: "formule", front: "Formule du diviseur de tension ?", back: "U₂ = U · R₂/(R₁+R₂). Valable si la sortie est à vide." },
  { id: "fe5", subject: "elec", chapter: "Diviseur", type: "piege", front: "Condition de validité du diviseur de tension ?", back: "Aucun courant tiré au point milieu (sortie à vide ou charge négligeable)." },
  { id: "fe6", subject: "elec", chapter: "Sinusoïdal", type: "formule", front: "Impédances R, L, C ?", back: "Z_R = R ; Z_L = jLω ; Z_C = 1/(jCω)." },
  { id: "fe7", subject: "elec", chapter: "Sinusoïdal", type: "def", front: "Comportement de L et C aux fréquences extrêmes ?", back: "Basse fréq : L = fil, C = ouvert. Haute fréq : L = ouvert, C = fil." },
  { id: "fe8", subject: "elec", chapter: "Filtres", type: "formule", front: "Fonction de transfert d'un passe-bas RC ?", back: "H = 1/(1+jRCω) ; pulsation de coupure ω_c = 1/(RC)." },
  { id: "fe9", subject: "elec", chapter: "Filtres", type: "formule", front: "Gain en décibels ?", back: "G_dB = 20·log₁₀(|H|). À la coupure : −3 dB (gain = 1/√2)." },
  { id: "fe10", subject: "elec", chapter: "Filtres", type: "methode", front: "Reconnaître un filtre sur un Bode ?", back: "Gain plat puis chute = passe-bas ; chute puis plat = passe-haut ; bosse = passe-bande." },
  { id: "fe11", subject: "elec", chapter: "AOP", type: "def", front: "Hypothèses de l'AOP idéal ?", back: "i⁺ = i⁻ = 0 (pas de courant d'entrée) ; en régime linéaire V⁺ = V⁻." },
  { id: "fe12", subject: "elec", chapter: "AOP", type: "piege", front: "Quand V⁺ = V⁻ est-il valable ?", back: "Seulement si l'AOP a une contre-réaction sur l'entrée − (régime linéaire). Sinon : saturation." },
  { id: "fe13", subject: "elec", chapter: "AOP", type: "formule", front: "Gain de l'ampli non inverseur ?", back: "Vs = (1 + R₂/R₁)·Ve. Inverseur : Vs = −(R₂/R₁)·Ve." },

  /* --- INFO (complément) --- */
  { id: "fi18", subject: "info", chapter: "Langage C", type: "piege", front: "Différence entre = et == ?", back: "= est une affectation, == une comparaison. if(x=0) affecte au lieu de tester." },
  { id: "fi19", subject: "info", chapter: "Langage C", type: "def", front: "Format printf de int, float, char, chaîne ?", back: "%d pour int, %f pour float, %c pour char, %s pour une chaîne." },
  { id: "fi20", subject: "info", chapter: "Pointeurs", type: "code", front: "Échanger deux entiers via pointeurs", back: "void echange(int*a,int*b){int t=*a;*a=*b;*b=t;}" },
  { id: "fi21", subject: "info", chapter: "Pointeurs", type: "def", front: "Que vaut tab[i] en notation pointeur ?", back: "*(tab + i). Le nom du tableau est l'adresse de la 1re case." },
  { id: "fi22", subject: "info", chapter: "Pointeurs", type: "piege", front: "Retourner l'adresse d'une variable locale ?", back: "Interdit : la variable est détruite à la sortie → dangling pointer." },
  { id: "fi23", subject: "info", chapter: "Tableaux", type: "piege", front: "Erreur d'indice la plus fréquente ?", back: "Boucler i <= n : on accède à tab[n] qui n'existe pas. Il faut i < n." },
  { id: "fi24", subject: "info", chapter: "Tableaux", type: "code", front: "Allouer un tableau dynamique de n int", back: "int *t = malloc(n * sizeof(int)); if(t==NULL) return 1;" },
  { id: "fi25", subject: "info", chapter: "Allocation", type: "def", front: "Différence malloc / realloc ?", back: "malloc alloue un bloc neuf ; realloc redimensionne un bloc existant en préservant son contenu." },
  { id: "fi26", subject: "info", chapter: "Allocation", type: "piege", front: "Pourquoi un tmp pour realloc ?", back: "realloc peut renvoyer NULL : sans tmp on perd l'adresse du bloc d'origine." },
  { id: "fi27", subject: "info", chapter: "Structures", type: "code", front: "Déclarer un type structuré t_point", back: "typedef struct { int x, y; } t_point;" },
  { id: "fi28", subject: "info", chapter: "Structures", type: "def", front: "p->x équivaut à quoi ?", back: "(*p).x : on déréférence le pointeur puis on accède au champ." },
  { id: "fi29", subject: "info", chapter: "Listes", type: "code", front: "Insertion en tête d'une liste", back: "nv->suivant = tete; tete = nv;" },
  { id: "fi30", subject: "info", chapter: "Listes", type: "methode", front: "Supprimer un maillon ?", back: "Relier le précédent au suivant (prec->suivant = c->suivant), puis free(c)." },
  { id: "fi31", subject: "info", chapter: "Piles & Files", type: "partiel", front: "Algo : copier une pile en gardant l'ordre", back: "Deux inversions : P1→tmp, puis tmp→P1 et P2 simultanément." },
  { id: "fi32", subject: "info", chapter: "Piles & Files", type: "methode", front: "Sommer une file sans la modifier ?", back: "Boucler tailleF fois : défiler, ajouter, réenfiler. La file fait un tour complet." },
  { id: "fi33", subject: "info", chapter: "Tas", type: "def", front: "Qu'y a-t-il à la racine d'un tas_max ?", back: "L'élément de plus grande clé (plus haute priorité) : il sortira en premier." },
  { id: "fi34", subject: "info", chapter: "Tas", type: "def", front: "Différence file vs file de priorité ?", back: "La file suit l'ordre d'arrivée (FIFO) ; la file de priorité suit la clé/priorité." },
  { id: "fi35", subject: "info", chapter: "Récursivité", type: "code", front: "Compter les maillons d'une liste (récursif)", back: "if(tete==NULL) return 0; return 1 + compter(tete->suivant);" },
  { id: "fi36", subject: "info", chapter: "Récursivité", type: "piege", front: "Récursivité sans cas de base ?", back: "La pile d'appels déborde (stack overflow), le programme plante." },
  { id: "fi37", subject: "info", chapter: "Fichiers", type: "code", front: "Ouvrir un fichier en lecture en sécurité", back: "FILE*f=fopen(\"d.txt\",\"r\"); if(f==NULL) return 1;" },
  { id: "fi38", subject: "info", chapter: "Fichiers", type: "methode", front: "Recharger un nombre variable de données ?", back: "Écrire n en 1re ligne ; au chargement, lire n puis malloc(n*...)." },
  { id: "fi39", subject: "info", chapter: "Allegro", type: "def", front: "Rôle de blit ?", back: "Copier une zone d'une BITMAP vers une autre (ex : buffer vers screen)." },
  { id: "fi40", subject: "info", chapter: "Allegro", type: "methode", front: "Les 3 étapes d'une boucle de jeu ?", back: "1) lire les entrées, 2) mettre à jour, 3) dessiner sur le buffer puis blitter." },

  /* --- MATHS (complément) --- */
  { id: "fm16", subject: "math", chapter: "DL", type: "formule", front: "DL de (1+x)ᵅ en 0 ?", back: "1 + αx + α(α−1)/2! x² + ... + o(xⁿ)" },
  { id: "fm17", subject: "math", chapter: "DL", type: "formule", front: "DL de 1/(1−x) en 0 ?", back: "1 + x + x² + x³ + ... + xⁿ + o(xⁿ)" },
  { id: "fm18", subject: "math", chapter: "DL", type: "def", front: "Formule de Taylor-Young ?", back: "f(x) = Σ f⁽ᵏ⁾(a)/k! (x−a)ᵏ + o((x−a)ⁿ)" },
  { id: "fm19", subject: "math", chapter: "DL", type: "methode", front: "Calculer un DL en a ≠ 0 ?", back: "Poser X = x − a (qui tend vers 0) et se ramener à un DL en 0." },
  { id: "fm20", subject: "math", chapter: "DL", type: "methode", front: "DL d'une puissance variable f(x)^g(x) ?", back: "Écrire f^g = e^(g·ln f), puis faire le DL de l'exposant." },
  { id: "fm21", subject: "math", chapter: "DL", type: "def", front: "Équivalent d'une fonction en a ?", back: "Le premier terme non nul de son DL. Ex : sin x ∼₀ x." },
  { id: "fm22", subject: "math", chapter: "Intégrales", type: "def", front: "Quand une intégrale est-elle généralisée ?", back: "Borne infinie, ou fonction non définie en une borne." },
  { id: "fm23", subject: "math", chapter: "Intégrales", type: "methode", front: "Critère de comparaison (f positives) ?", back: "Si 0≤f≤g : g converge ⟹ f converge ; f diverge ⟹ g diverge." },
  { id: "fm24", subject: "math", chapter: "Intégrales", type: "piege", front: "Le critère de Riemann dépend de…", back: "La borne : α>1 à l'infini, β<1 en 0. Les inverser donne la mauvaise conclusion." },
  { id: "fm25", subject: "math", chapter: "Intégrales", type: "formule", front: "∫₀^∞ e^(−x) dx vaut ?", back: "1. Primitive −e^(−x), limite [−e^(−x)]₀^∞ = 1." },
  { id: "fm26", subject: "math", chapter: "Matrices", type: "def", front: "Condition pour que AB soit défini ?", back: "Nb de colonnes de A = nb de lignes de B." },
  { id: "fm27", subject: "math", chapter: "Matrices", type: "formule", front: "Terme général du produit (AB)ᵢⱼ ?", back: "Somme sur k de Aᵢₖ · Bₖⱼ." },
  { id: "fm28", subject: "math", chapter: "Matrices", type: "methode", front: "Méthode de Gauss-Jordan pour A⁻¹ ?", back: "Échelonner (A | I) par opérations sur les lignes jusqu'à (I | A⁻¹)." },
  { id: "fm29", subject: "math", chapter: "Matrices", type: "def", front: "Rôle de la matrice identité I ?", back: "Élément neutre du produit : AI = IA = A." },
  { id: "fm30", subject: "math", chapter: "Déterminants", type: "formule", front: "Règle de Sarrus (3×3) ?", back: "det = aei + bfg + cdh − ceg − bdi − afh." },
  { id: "fm31", subject: "math", chapter: "Déterminants", type: "formule", front: "Développement par cofacteurs ?", back: "det = Σⱼ (−1)^(i+j) · aᵢⱼ · Mᵢⱼ (Mᵢⱼ = mineur)." },
  { id: "fm32", subject: "math", chapter: "Déterminants", type: "piege", front: "Échanger deux lignes d'un déterminant ?", back: "Change le SIGNE du déterminant." },
  { id: "fm33", subject: "math", chapter: "Déterminants", type: "methode", front: "Déterminant d'une matrice triangulaire ?", back: "C'est le produit des éléments de la diagonale." },
  { id: "fm34", subject: "math", chapter: "Déterminants", type: "def", front: "Ajouter à une ligne un multiple d'une autre ?", back: "Ne change PAS le déterminant (opération de Gauss autorisée)." },
  { id: "fm35", subject: "math", chapter: "DL", type: "piege", front: "Peut-on remplacer un équivalent dans une somme ?", back: "Non : les équivalents s'utilisent dans les produits et quotients, pas les sommes." },
  { id: "fm36", subject: "math", chapter: "Intégrales", type: "partiel", front: "Étapes pour la nature d'une intégrale ?", back: "Borne problématique → équivalent → comparer à Riemann → conclure." },
  { id: "fm37", subject: "math", chapter: "Matrices", type: "partiel", front: "Résoudre AX=B, deux méthodes ?", back: "Inverse (X=A⁻¹B si A inversible) ou Gauss (échelonner (A|B))." },
  { id: "fm38", subject: "math", chapter: "Déterminants", type: "methode", front: "Astuce pour développer un déterminant ?", back: "Développer selon la ligne/colonne qui a le plus de zéros." },
  { id: "fm39", subject: "math", chapter: "DL", type: "formule", front: "DL de tan(x) à l'ordre 3 ?", back: "tan(x) = x + x³/3 + o(x³)." },
  { id: "fm40", subject: "math", chapter: "Intégrales", type: "def", front: "Convergence absolue ⟹ ?", back: "⟹ convergence. Si ∫|f| converge, alors ∫f converge." },

  /* --- MÉCANIQUE (complément) --- */
  { id: "fc14", subject: "meca", chapter: "Travail", type: "def", front: "Signe du travail moteur / résistant ?", back: "Moteur : W > 0 (accélère). Résistant : W < 0 (freine)." },
  { id: "fc15", subject: "meca", chapter: "Travail", type: "formule", front: "Travail élémentaire d'une force ?", back: "δW = F⃗ · dl⃗. Total : W = ∫ F⃗·dl⃗." },
  { id: "fc16", subject: "meca", chapter: "Travail", type: "piege", front: "Travail et puissance, quelle différence ?", back: "Travail = énergie (J). Puissance = énergie/temps (W). P = W/Δt." },
  { id: "fc17", subject: "meca", chapter: "Énergie cinétique", type: "methode", front: "Quand utiliser le TEC ?", back: "Pour relier une variation de vitesse au travail des forces." },
  { id: "fc18", subject: "meca", chapter: "Énergie cinétique", type: "formule", front: "Théorème de la puissance cinétique ?", back: "dEc/dt = Σ P(forces)." },
  { id: "fc19", subject: "meca", chapter: "Énergie potentielle", type: "def", front: "Force NON conservative, exemple ?", back: "Les frottements : leur travail dépend du chemin, ils dissipent l'énergie." },
  { id: "fc20", subject: "meca", chapter: "Énergie potentielle", type: "formule", front: "Lien force / énergie potentielle (1D) ?", back: "F = −dEp/dx. La force dérive de l'énergie potentielle." },
  { id: "fc21", subject: "meca", chapter: "Énergie potentielle", type: "methode", front: "Trouver une position d'équilibre ?", back: "Résoudre dEp/dx = 0. Minimum → stable, maximum → instable." },
  { id: "fc22", subject: "meca", chapter: "Énergie mécanique", type: "piege", front: "Erreur classique avec les frottements ?", back: "Appliquer la conservation de Em alors qu'il y a des frottements : Em n'est plus conservée." },
  { id: "fc23", subject: "meca", chapter: "Énergie mécanique", type: "methode", front: "Mettre un oscillateur en équation par l'énergie ?", back: "Écrire Em, puis dEm/dt = puissance non conservative (0 si conservatif)." },
  { id: "fc24", subject: "meca", chapter: "Oscillateur", type: "formule", front: "Solution de ẍ + ω₀²x = 0 ?", back: "x(t) = A·cos(ω₀t + φ), avec A et φ donnés par les conditions initiales." },
  { id: "fc25", subject: "meca", chapter: "Oscillateur", type: "formule", front: "Période propre T₀ ?", back: "T₀ = 2π/ω₀." },
  { id: "fc26", subject: "meca", chapter: "Oscillateur", type: "piege", front: "Fréquence ou pulsation ?", back: "f en Hz, ω en rad/s. ω = 2πf. Ne pas les confondre." },
  { id: "fc27", subject: "meca", chapter: "Oscillateur", type: "formule", front: "Énergie d'un oscillateur harmonique ?", back: "Em = ½kA² = constante (sans amortissement)." },
  { id: "fc28", subject: "meca", chapter: "Amortissement", type: "formule", front: "Équation canonique de l'oscillateur amorti ?", back: "ẍ + (ω₀/Q)ẋ + ω₀²x = 0." },
  { id: "fc29", subject: "meca", chapter: "Amortissement", type: "def", front: "Quel régime revient le plus vite à l'équilibre ?", back: "Le régime critique (Q = 1/2), sans osciller." },
  { id: "fc30", subject: "meca", chapter: "Amortissement", type: "formule", front: "Forme de x(t) en pseudo-périodique ?", back: "x(t) = A·e^(−t/τ)·cos(ωt+φ), avec ω < ω₀." },
  { id: "fc31", subject: "meca", chapter: "Amortissement", type: "def", front: "Que mesure le temps caractéristique τ ?", back: "La durée d'amortissement : l'amplitude décroît en e^(−t/τ)." },
  { id: "fc32", subject: "meca", chapter: "Travail", type: "formule", front: "Puissance instantanée d'une force ?", back: "P = F⃗ · v⃗." },
  { id: "fc33", subject: "meca", chapter: "Énergie cinétique", type: "partiel", front: "Vitesse en bas d'une pente sans frottement ?", back: "TEC : ½mv² = mgh ⟹ v = √(2gh)." },
  { id: "fc34", subject: "meca", chapter: "Oscillateur", type: "partiel", front: "ω₀ d'un masse-ressort et d'un pendule ?", back: "Masse-ressort : √(k/m). Pendule : √(g/L)." },
  { id: "fc35", subject: "meca", chapter: "Énergie mécanique", type: "def", front: "Que dit le TEM ?", back: "ΔEm = W(forces non conservatives)." },
  { id: "fc36", subject: "meca", chapter: "Amortissement", type: "methode", front: "Identifier le régime sur une courbe ?", back: "Oscille en s'atténuant = pseudo-périodique ; revient sans osciller = critique/apériodique." },
  { id: "fc37", subject: "meca", chapter: "Énergie potentielle", type: "formule", front: "Ep de pesanteur et de ressort ?", back: "Ep(pesanteur) = mgz ; Ep(ressort) = ½kx²." },
  { id: "fc38", subject: "meca", chapter: "Oscillateur", type: "piege", front: "En pseudo-périodique, ω par rapport à ω₀ ?", back: "ω < ω₀ : l'amortissement diminue la pulsation." },

  /* --- ÉLECTRONIQUE (complément) --- */
  { id: "fe14", subject: "elec", chapter: "Lois", type: "formule", front: "Puissance dissipée par une résistance ?", back: "P = U·I = R·I² = U²/R." },
  { id: "fe15", subject: "elec", chapter: "Lois", type: "def", front: "Loi des nœuds, principe physique ?", back: "Conservation de la charge : Σ courants entrants = Σ sortants." },
  { id: "fe16", subject: "elec", chapter: "Lois", type: "def", front: "Loi des mailles ?", back: "La somme algébrique des tensions sur une maille fermée est nulle." },
  { id: "fe17", subject: "elec", chapter: "Lois", type: "methode", front: "Résistances en série / parallèle ?", back: "Série : R_eq = ΣR. Parallèle : 1/R_eq = Σ1/R." },
  { id: "fe18", subject: "elec", chapter: "Diviseur", type: "piege", front: "Quand le diviseur de tension est-il faux ?", back: "Si un courant est tiré au point milieu (charge non négligeable)." },
  { id: "fe19", subject: "elec", chapter: "Diviseur", type: "formule", front: "Diviseur de courant (R₁//R₂) ?", back: "I₁ = I · R₂/(R₁+R₂)." },
  { id: "fe20", subject: "elec", chapter: "Thévenin", type: "def", front: "Modèle de Thévenin ?", back: "Tout dipôle linéaire = générateur E_th en série avec R_th." },
  { id: "fe21", subject: "elec", chapter: "Thévenin", type: "methode", front: "Trouver R_th ?", back: "Résistance vue des bornes, sources éteintes (tension court-circuitée, courant ouvert)." },
  { id: "fe22", subject: "elec", chapter: "Sinusoïdal", type: "formule", front: "Valeur efficace d'une sinusoïde ?", back: "U_eff = U_max/√2." },
  { id: "fe23", subject: "elec", chapter: "Sinusoïdal", type: "formule", front: "Impédances Z_R, Z_L, Z_C ?", back: "Z_R = R ; Z_L = jLω ; Z_C = 1/(jCω)." },
  { id: "fe24", subject: "elec", chapter: "Sinusoïdal", type: "def", front: "Condensateur en BF et HF ?", back: "BF : interrupteur ouvert (Z→∞). HF : fil (Z→0)." },
  { id: "fe25", subject: "elec", chapter: "Sinusoïdal", type: "def", front: "Bobine en BF et HF ?", back: "BF : fil (Z→0). HF : interrupteur ouvert (Z→∞)." },
  { id: "fe26", subject: "elec", chapter: "Sinusoïdal", type: "piege", front: "Erreur en régime sinusoïdal ?", back: "Traiter L et C comme des résistances : il faut les impédances complexes." },
  { id: "fe27", subject: "elec", chapter: "Filtres", type: "formule", front: "Transfert d'un passe-bas RC ?", back: "H = 1/(1+jRCω)." },
  { id: "fe28", subject: "elec", chapter: "Filtres", type: "formule", front: "Transfert d'un passe-haut RC ?", back: "H = jRCω/(1+jRCω)." },
  { id: "fe29", subject: "elec", chapter: "Filtres", type: "formule", front: "Fréquence de coupure d'un RC ?", back: "ω_c = 1/(RC) ; f_c = 1/(2πRC)." },
  { id: "fe30", subject: "elec", chapter: "Filtres", type: "def", front: "Passe-bande et coupe-bande ?", back: "Passe-bande : laisse une plage de fréquences (bosse). Coupe-bande : en bloque une (creux)." },
  { id: "fe31", subject: "elec", chapter: "Bode", type: "methode", front: "Où lire la fréquence de coupure ?", back: "Sur la courbe du GAIN, à −3 dB sous la bande passante." },
  { id: "fe32", subject: "elec", chapter: "Bode", type: "formule", front: "Ordre d'un filtre vs pente ?", back: "−20 dB/décade = ordre 1 ; −40 dB/décade = ordre 2." },
  { id: "fe33", subject: "elec", chapter: "Bode", type: "def", front: "Bande passante d'un passe-bande ?", back: "Δf = f_c(haute) − f_c(basse), entre les deux points à −3 dB." },
  { id: "fe34", subject: "elec", chapter: "Bode", type: "piege", front: "Erreur fréquente sur le −3 dB ?", back: "Le lire sur la courbe de phase au lieu de la courbe de gain." },
  { id: "fe35", subject: "elec", chapter: "AOP", type: "formule", front: "Gain du montage inverseur ?", back: "Vs = −(R₂/R₁)·Ve." },
  { id: "fe36", subject: "elec", chapter: "AOP", type: "def", front: "Montage suiveur, à quoi sert-il ?", back: "Vs = Ve : adaptateur d'impédance (sortie basse impédance)." },
  { id: "fe37", subject: "elec", chapter: "AOP", type: "def", front: "AOP saturé, quand ?", back: "Sans contre-réaction sur l'entrée − : la sortie vaut +Vsat ou −Vsat." },
  { id: "fe38", subject: "elec", chapter: "AOP", type: "def", front: "Trigger de Schmitt, principe ?", back: "Comparateur à hystérésis : deux seuils de basculement différents, immunise contre le bruit." },
  { id: "fe39", subject: "elec", chapter: "AOP", type: "methode", front: "Analyser un montage AOP linéaire ?", back: "Vérifier la contre-réaction sur −, poser i⁺=i⁻=0 et V⁺=V⁻, loi des nœuds." },
  { id: "fe40", subject: "elec", chapter: "Bode", type: "methode", front: "Reconnaître un filtre sur un Bode ?", back: "Plat puis chute = passe-bas ; monte puis plat = passe-haut ; bosse = passe-bande." },
  { id: "fe41", subject: "elec", chapter: "Condensateur", type: "formule", front: "Charge et énergie d'un condensateur ?", back: "Q = C·U ; i = C·dU/dt ; E = ½CU²." },
  { id: "fe42", subject: "elec", chapter: "Bobine", type: "formule", front: "Tension et énergie d'une bobine ?", back: "U = L·di/dt ; E = ½LI²." },
  { id: "fe43", subject: "elec", chapter: "Transitoire", type: "formule", front: "Constante de temps d'un RC et d'un RL ?", back: "RC : τ = R·C. RL : τ = L/R. Régime établi après ≈ 5τ." },
  { id: "fe44", subject: "elec", chapter: "Transitoire", type: "def", front: "Tension d'un condensateur à t = τ (charge) ?", back: "u(τ) = E·(1 − e⁻¹) ≈ 0,63·E (63 % de la valeur finale)." },
  { id: "fe45", subject: "elec", chapter: "Condensateur", type: "piege", front: "Que ne peut pas faire la tension d'un condensateur ?", back: "Sauter brusquement : elle est continue. (Le courant d'une bobine non plus.)" },
  { id: "fe46", subject: "elec", chapter: "Filtres", type: "def", front: "Bande passante d'un passe-bande ?", back: "Δf = f₂ − f₁, entre les deux fréquences de coupure à −3 dB." },
  { id: "fe47", subject: "elec", chapter: "Filtres", type: "piege", front: "Passe-bande ou coupe-bande sur un Bode ?", back: "Une bosse = passe-bande ; un creux = coupe-bande (réjecteur)." },
  { id: "fe48", subject: "elec", chapter: "AOP", type: "methode", front: "AOP en régime linéaire ou saturé ?", back: "Contre-réaction sur l'entrée − → linéaire (V⁺=V⁻). Sinon → saturé (Vs = ±Vsat)." },
];

/* ================== QUIZ ================== */

const QUIZZES = [
  { id: "qz-info1", subject: "info", title: "Informatique — Pointeurs & mémoire", kind: "qcm", questions: [
    { q: "Que contient un pointeur ?", o: ["Une valeur", "Une adresse mémoire", "Un type"], a: 1, e: "C'est une variable dont la valeur est une adresse." },
    { q: "Que retourne malloc en cas d'échec ?", o: ["0", "NULL", "-1"], a: 1, e: "malloc retourne NULL : il faut toujours le tester." },
    { q: "calloc, par rapport à malloc…", o: ["est plus lent", "initialise à zéro", "ne nécessite pas de free"], a: 1, e: "calloc met la mémoire allouée à zéro." },
    { q: "Pour une struct à champ dynamique, on libère…", o: ["la struct puis le champ", "le champ puis la struct", "peu importe"], a: 1, e: "D'abord le champ, sinon on perd son adresse." },
    { q: "Peut-on déréférencer un void* directement ?", o: ["Oui", "Non, cast obligatoire", "Seulement les int"], a: 1, e: "Le type pointé est inconnu : il faut caster." },
    { q: "Retourner l'adresse d'une variable locale provoque…", o: ["rien", "un dangling pointer", "une fuite mémoire"], a: 1, e: "La variable est détruite à la sortie de la fonction." },
  ]},
  { id: "qz-info2", subject: "info", title: "Informatique — Structures de données", kind: "qcm", questions: [
    { q: "Une pile fonctionne en…", o: ["FIFO", "LIFO", "priorité"], a: 1, e: "Pile = LIFO : dernier entré, premier sorti." },
    { q: "Une file fonctionne en…", o: ["LIFO", "FIFO", "aléatoire"], a: 1, e: "File = FIFO : premier entré, premier sorti." },
    { q: "Pour inverser une file, on utilise…", o: ["une 2e file", "une pile", "un tableau trié"], a: 1, e: "La pile inverse l'ordre ; une 2e file recopie à l'identique." },
    { q: "Dans une liste chaînée, le dernier maillon pointe sur…", o: ["le premier", "NULL", "lui-même"], a: 1, e: "Le champ suivant du dernier maillon vaut NULL." },
    { q: "Combien d'ancres pour une file par liste chaînée ?", o: ["une", "deux (tête et fin)", "trois"], a: 1, e: "Double ancrage : tête pour défiler, fin pour enfiler." },
    { q: "Tout algo récursif doit avoir…", o: ["une boucle", "un cas de base", "un tableau"], a: 1, e: "Sans cas de base : récursion infinie." },
  ]},
  { id: "qz-info-vf", subject: "info", title: "Informatique — Vrai / Faux", kind: "vf", questions: [
    { q: "Le mode \"w\" de fopen ajoute à la fin d'un fichier.", o: ["Vrai", "Faux"], a: 1, e: "Faux : \"w\" écrase. C'est \"a\" qui ajoute." },
    { q: "p->x est équivalent à (*p).x.", o: ["Vrai", "Faux"], a: 0, e: "Vrai, c'est un raccourci." },
    { q: "Une liste chaînée donne l'accès direct à la case i en O(1).", o: ["Vrai", "Faux"], a: 1, e: "Faux : il faut parcourir, O(n)." },
    { q: "Il faut toujours tester le retour de malloc.", o: ["Vrai", "Faux"], a: 0, e: "Vrai : il peut retourner NULL." },
    { q: "Le double buffering évite les clignotements.", o: ["Vrai", "Faux"], a: 0, e: "Vrai." },
  ]},
  { id: "qz-math1", subject: "math", title: "Mathématiques — DL & Intégrales", kind: "qcm", questions: [
    { q: "Le DL de cos(x) en 0 commence par…", o: ["x", "1", "x²"], a: 1, e: "cos(x) = 1 − x²/2! + ..." },
    { q: "Le DL de ln(1+x) en 0 commence par…", o: ["1", "x", "−x²/2"], a: 1, e: "ln(1+x) = x − x²/2 + ..." },
    { q: "∫₁^∞ dx/xᵅ converge si…", o: ["α > 1", "α < 1", "α = 1"], a: 0, e: "Riemann à l'infini : convergence pour α > 1." },
    { q: "∫₀¹ dx/xᵝ converge si…", o: ["β > 1", "β < 1", "β = 1"], a: 1, e: "Riemann en 0 : convergence pour β < 1." },
    { q: "Un équivalent de f en a, c'est…", o: ["le DL complet", "le 1er terme non nul du DL", "la dérivée"], a: 1, e: "L'équivalent est le premier terme non nul." },
    { q: "Pour calculer un DL en +∞, on pose…", o: ["X = x − a", "X = 1/x", "X = x²"], a: 1, e: "X = 1/x → 0 quand x → +∞." },
  ]},
  { id: "qz-math2", subject: "math", title: "Mathématiques — Matrices & Déterminants", kind: "qcm", questions: [
    { q: "Le produit matriciel est-il commutatif ?", o: ["Oui", "Non", "Parfois"], a: 1, e: "AB ≠ BA en général." },
    { q: "A est inversible si et seulement si…", o: ["det(A) = 0", "det(A) ≠ 0", "A est carrée"], a: 1, e: "Inversibilité ⟺ déterminant non nul." },
    { q: "det d'une matrice avec deux lignes proportionnelles ?", o: ["1", "0", "indéfini"], a: 1, e: "Deux lignes liées → déterminant nul." },
    { q: "det 2×2 de [[a,b],[c,d]] ?", o: ["ab − cd", "ad − bc", "ac − bd"], a: 1, e: "det = ad − bc." },
    { q: "Échanger deux lignes d'un déterminant…", o: ["ne change rien", "change le signe", "le double"], a: 1, e: "L'échange de deux lignes change le signe." },
    { q: "Pour résoudre AX = B avec A inversible…", o: ["X = AB", "X = A⁻¹B", "X = B/A"], a: 1, e: "X = A⁻¹B." },
  ]},
  { id: "qz-meca1", subject: "meca", title: "Mécanique — Énergie & Travail", kind: "qcm", questions: [
    { q: "L'énergie cinétique vaut…", o: ["mgz", "½mv²", "½kx²"], a: 1, e: "Ec = ½mv²." },
    { q: "Le TEC dit que ΔEc = …", o: ["0", "Σ W(forces)", "Em"], a: 1, e: "ΔEc = somme des travaux des forces extérieures." },
    { q: "Une force conservative…", o: ["dépend du chemin", "ne dépend que des extrémités", "dissipe de l'énergie"], a: 1, e: "Son travail ne dépend que du départ et de l'arrivée." },
    { q: "Em est conservée quand…", o: ["il y a des frottements", "pas de force non conservative", "toujours"], a: 1, e: "Sans force non conservative, Em = constante." },
    { q: "Ep d'un ressort (allongement x) ?", o: ["kx", "½kx²", "mgx"], a: 1, e: "Ep(ressort) = ½kx²." },
    { q: "Un équilibre stable correspond à…", o: ["un maximum de Ep", "un minimum de Ep", "Ep = 0"], a: 1, e: "Minimum de Ep = puits de potentiel = stable." },
  ]},
  { id: "qz-meca2", subject: "meca", title: "Mécanique — Oscillations", kind: "qcm", questions: [
    { q: "L'équation de l'oscillateur harmonique est…", o: ["ẍ + ω₀²x = 0", "ẍ = g", "x = vt"], a: 0, e: "ẍ + ω₀²x = 0." },
    { q: "Pulsation propre d'un masse-ressort ?", o: ["√(g/L)", "√(k/m)", "k/m"], a: 1, e: "ω₀ = √(k/m)." },
    { q: "Deux ressorts en parallèle : k_eq = …", o: ["k₁+k₂", "1/k₁+1/k₂", "k₁k₂"], a: 0, e: "En parallèle, k_eq = k₁ + k₂." },
    { q: "Une courbe qui oscille en s'atténuant : régime…", o: ["pseudo-périodique", "apériodique", "critique"], a: 0, e: "Oscillation + atténuation = pseudo-périodique." },
    { q: "Le régime critique correspond à…", o: ["Q > 1/2", "Q = 1/2", "Q < 1/2"], a: 1, e: "Q = 1/2 : retour le plus rapide sans osciller." },
    { q: "L'énergie d'un oscillateur amorti…", o: ["reste constante", "décroît (dissipée)", "augmente"], a: 1, e: "Les frottements dissipent l'énergie." },
  ]},
  { id: "qz-elec1", subject: "elec", title: "Électronique — Circuits", kind: "qcm", questions: [
    { q: "La loi d'Ohm s'écrit…", o: ["U = R/I", "U = R·I", "U = I/R"], a: 1, e: "U = R·I." },
    { q: "Résistances en série : R_eq = …", o: ["R₁+R₂", "1/R₁+1/R₂", "R₁R₂"], a: 0, e: "En série on additionne les résistances." },
    { q: "Le diviseur de tension donne U₂ = …", o: ["U·R₁/(R₁+R₂)", "U·R₂/(R₁+R₂)", "U·(R₁+R₂)/R₂"], a: 1, e: "U₂ = U·R₂/(R₁+R₂)." },
    { q: "La loi des nœuds traduit…", o: ["la conservation de la charge", "la loi d'Ohm", "Σ tensions = 0"], a: 0, e: "Σ courants entrants = Σ sortants." },
    { q: "Impédance d'un condensateur ?", o: ["jLω", "1/(jCω)", "R"], a: 1, e: "Z_C = 1/(jCω)." },
    { q: "À la fréquence de coupure, le gain vaut…", o: ["1", "1/√2 (−3 dB)", "0"], a: 1, e: "Gain = 1/√2, soit −3 dB." },
  ]},
  { id: "qz-elec2", subject: "elec", title: "Électronique — AOP & Filtres", kind: "qcm", questions: [
    { q: "Pour un AOP idéal, les courants d'entrée valent…", o: ["infini", "zéro", "1 A"], a: 1, e: "i⁺ = i⁻ = 0." },
    { q: "V⁺ = V⁻ est valable…", o: ["toujours", "en régime linéaire (contre-réaction sur −)", "jamais"], a: 1, e: "Seulement avec rétroaction sur l'entrée inverseuse." },
    { q: "Gain de l'ampli non inverseur ?", o: ["−R₂/R₁", "1+R₂/R₁", "R₁/R₂"], a: 1, e: "Vs = (1+R₂/R₁)·Ve." },
    { q: "Un passe-bas RC a pour transfert…", o: ["1/(1+jRCω)", "jRCω", "1+jRCω"], a: 0, e: "H = 1/(1+jRCω)." },
    { q: "Gain plat puis chute sur un Bode : filtre…", o: ["passe-haut", "passe-bas", "passe-bande"], a: 1, e: "Passe-bas : laisse les basses fréquences." },
    { q: "Le gain en dB se calcule par…", o: ["10·log(|H|)", "20·log₁₀(|H|)", "|H|²"], a: 1, e: "G_dB = 20·log₁₀(|H|)." },
  ]},

  { id: "qz-info3", subject: "info", title: "Informatique — Pièges classiques", kind: "qcm", questions: [
    { q: "if (x = 0) fait quoi ?", o: ["teste x", "affecte 0 à x", "erreur de compilation"], a: 1, e: "= est une affectation ; il fallait ==." },
    { q: "Boucler i <= n sur un tableau de taille n…", o: ["est correct", "dépasse le tableau", "est plus rapide"], a: 1, e: "Les indices vont de 0 à n−1 : i < n." },
    { q: "Pour une struct à champ dynamique, on libère…", o: ["la struct puis le champ", "le champ puis la struct", "rien"], a: 1, e: "Le champ d'abord, sinon on perd son adresse." },
    { q: "Utiliser un pointeur après free…", o: ["est sûr", "provoque un comportement indéfini", "le réalloue"], a: 1, e: "La zone est libérée : accès interdit." },
    { q: "Dépiler une pile vide…", o: ["renvoie 0", "doit être évité (tester pileVide)", "la remplit"], a: 1, e: "Toujours tester pileVide avant de dépiler." },
  ]},
  { id: "qz-info4", subject: "info", title: "Informatique — Spécial partiel", kind: "qcm", questions: [
    { q: "Schéma type d'un main de partiel ?", o: ["traiter puis init", "init → remplir → traiter → libérer", "libérer → init"], a: 1, e: "Toujours dans cet ordre." },
    { q: "defiler renvoie un void* : pour lire un int…", o: ["*defiler(f)", "(int*)defiler(f) puis *", "defiler(f).val"], a: 1, e: "Caster en int* puis déréférencer." },
    { q: "Inverser une file se fait avec…", o: ["une 2e file", "une pile", "un tri"], a: 1, e: "La pile inverse l'ordre." },
    { q: "File de priorité = structure…", o: ["pile", "tas", "tableau trié à chaque fois"], a: 1, e: "Le tas donne la racine = plus haute priorité." },
    { q: "Saisir une chaîne dynamique : l'ordre ?", o: ["malloc puis fgets", "fgets → strcspn → malloc(strlen+1) → strcpy", "scanf seul"], a: 1, e: "On lit dans un buffer, puis on alloue la taille exacte." },
  ]},
  { id: "qz-math3", subject: "math", title: "Mathématiques — Quiz formules", kind: "qcm", questions: [
    { q: "DL de eˣ en 0 ?", o: ["1+x+x²/2+...", "x+x²/2+...", "1−x+x²..."], a: 0, e: "eˣ = 1 + x + x²/2! + ..." },
    { q: "Déterminant 2×2 [[a,b],[c,d]] ?", o: ["ab−cd", "ad−bc", "ac−bd"], a: 1, e: "det = ad − bc." },
    { q: "Inverse 2×2 : facteur devant ?", o: ["1/(a+d)", "1/(ad−bc)", "ad−bc"], a: 1, e: "A⁻¹ = 1/(ad−bc) · [[d,−b],[−c,a]]." },
    { q: "∫₀^∞ e^(−x) dx vaut ?", o: ["0", "1", "∞"], a: 1, e: "[−e^(−x)]₀^∞ = 1." },
    { q: "DL de cos(x) en 0 ?", o: ["x−x³/6", "1−x²/2+x⁴/24", "1+x²/2"], a: 1, e: "cos n'a que des termes pairs." },
  ]},
  { id: "qz-math4", subject: "math", title: "Mathématiques — Quiz pièges", kind: "qcm", questions: [
    { q: "∫₁^∞ dx/xᵅ converge si…", o: ["α<1", "α>1", "α=1"], a: 1, e: "Riemann à l'infini : α>1." },
    { q: "∫₀¹ dx/xᵝ converge si…", o: ["β<1", "β>1", "toujours"], a: 0, e: "Riemann en 0 : β<1." },
    { q: "Un équivalent peut-il remplacer un terme dans une somme ?", o: ["oui", "non", "parfois"], a: 1, e: "Uniquement dans produits et quotients." },
    { q: "AB = BA ?", o: ["toujours", "jamais", "pas en général"], a: 2, e: "Le produit matriciel n'est pas commutatif." },
    { q: "Deux lignes proportionnelles → déterminant…", o: ["1", "0", "négatif"], a: 1, e: "Lignes liées ⟹ det nul." },
  ]},
  { id: "qz-math5", subject: "math", title: "Mathématiques — Quiz difficile", kind: "qcm", questions: [
    { q: "lim(x→0) (sin x − x)/x³ ?", o: ["0", "−1/6", "1"], a: 1, e: "sin x − x = −x³/6 + o(x³)." },
    { q: "DL(0,3) de eˣcos(x) ?", o: ["1+x−x³/3", "1+x+x²", "1−x³/3"], a: 0, e: "Produit des DL tronqué à l'ordre 3." },
    { q: "∫₁^∞ dx/(x·√x), nature ?", o: ["diverge", "converge (α=3/2)", "indéterminé"], a: 1, e: "α = 3/2 > 1 → converge." },
    { q: "A inversible ⟺ ?", o: ["det A = 0", "det A ≠ 0", "A carrée"], a: 1, e: "Inversibilité ⟺ déterminant non nul." },
    { q: "det d'une matrice triangulaire ?", o: ["somme diagonale", "produit diagonale", "0"], a: 1, e: "C'est le produit des termes diagonaux." },
  ]},
  { id: "qz-meca3", subject: "meca", title: "Mécanique — Quiz formules", kind: "qcm", questions: [
    { q: "Énergie cinétique ?", o: ["mgz", "½mv²", "½kx²"], a: 1, e: "Ec = ½mv²." },
    { q: "Ep d'un ressort ?", o: ["kx", "½kx²", "mgx"], a: 1, e: "Ep = ½kx²." },
    { q: "Pulsation propre masse-ressort ?", o: ["√(k/m)", "k/m", "√(g/L)"], a: 0, e: "ω₀ = √(k/m)." },
    { q: "Travail d'une force constante ?", o: ["F·AB·cos θ", "F/AB", "F·v"], a: 0, e: "W = F·AB·cos(θ)." },
    { q: "Période propre T₀ ?", o: ["2π/ω₀", "ω₀/2π", "2πω₀"], a: 0, e: "T₀ = 2π/ω₀." },
  ]},
  { id: "qz-meca4", subject: "meca", title: "Mécanique — Quiz pièges", kind: "qcm", questions: [
    { q: "Travail ou puissance pour une énergie en joules ?", o: ["puissance", "travail", "les deux"], a: 1, e: "Le travail est une énergie ; la puissance un débit d'énergie." },
    { q: "ω et f, relation ?", o: ["ω = f", "ω = 2πf", "ω = f/2π"], a: 1, e: "ω = 2πf." },
    { q: "Avec frottements, Em est…", o: ["conservée", "dissipée (décroît)", "constante"], a: 1, e: "ΔEm = W(frottements) < 0." },
    { q: "Courbe qui revient sans osciller : régime…", o: ["pseudo-périodique", "critique ou apériodique", "harmonique"], a: 1, e: "Pas d'oscillation = critique/apériodique." },
    { q: "Équilibre stable correspond à…", o: ["max de Ep", "min de Ep", "Ep = 0"], a: 1, e: "Minimum de Ep = puits = stable." },
  ]},
  { id: "qz-meca5", subject: "meca", title: "Mécanique — Quiz difficile", kind: "qcm", questions: [
    { q: "Vitesse en bas d'une pente lisse, hauteur h ?", o: ["√(gh)", "√(2gh)", "2gh"], a: 1, e: "TEC : ½mv² = mgh." },
    { q: "Équation canonique de l'oscillateur amorti ?", o: ["ẍ+ω₀²x=0", "ẍ+(ω₀/Q)ẋ+ω₀²x=0", "ẋ+ω₀x=0"], a: 1, e: "Forme canonique avec le facteur Q." },
    { q: "Ressorts en série, k_eq ?", o: ["k₁+k₂", "1/k_eq=1/k₁+1/k₂", "k₁k₂"], a: 1, e: "En série les inverses s'ajoutent." },
    { q: "Méthode énergétique : on annule…", o: ["Ec", "dEm/dt (si conservatif)", "Ep"], a: 1, e: "dEm/dt = 0 donne l'équation du mouvement." },
    { q: "En pseudo-périodique, ω vs ω₀ ?", o: ["ω > ω₀", "ω < ω₀", "ω = ω₀"], a: 1, e: "L'amortissement abaisse la pulsation." },
  ]},
  { id: "qz-elec3", subject: "elec", title: "Électronique — Quiz Bode & filtres", kind: "qcm", questions: [
    { q: "La coupure se lit à…", o: ["−3 dB sur le gain", "−3 dB sur la phase", "0 dB"], a: 0, e: "Sur la courbe du gain." },
    { q: "Pente −40 dB/décade : ordre…", o: ["1", "2", "4"], a: 1, e: "−20 dB/décade par ordre." },
    { q: "Gain plat puis chute = filtre…", o: ["passe-haut", "passe-bas", "passe-bande"], a: 1, e: "Passe-bas." },
    { q: "Bande passante d'un passe-bande ?", o: ["f_c haute − f_c basse", "f_c haute + basse", "1/f_c"], a: 0, e: "Écart entre les deux fréquences à −3 dB." },
    { q: "Gain en dB ?", o: ["10·log|H|", "20·log₁₀|H|", "|H|"], a: 1, e: "Pour une tension : 20·log₁₀." },
  ]},
  { id: "qz-elec4", subject: "elec", title: "Électronique — Quiz AOP & pièges", kind: "qcm", questions: [
    { q: "AOP idéal : courants d'entrée ?", o: ["infinis", "nuls", "1 A"], a: 1, e: "i⁺ = i⁻ = 0." },
    { q: "V⁺ = V⁻ valable…", o: ["toujours", "avec contre-réaction sur −", "jamais"], a: 1, e: "Sinon l'AOP est saturé." },
    { q: "Gain non inverseur ?", o: ["−R₂/R₁", "1+R₂/R₁", "R₁/R₂"], a: 1, e: "Vs = (1+R₂/R₁)Ve." },
    { q: "Sans contre-réaction sur −, l'AOP est…", o: ["linéaire", "saturé", "suiveur"], a: 1, e: "Sortie = ±Vsat." },
    { q: "Le trigger de Schmitt est un comparateur…", o: ["sans seuil", "à hystérésis", "linéaire"], a: 1, e: "Deux seuils de basculement." },
  ]},
];

const QUIZ_MODE_PARTIEL = {
  id: "qz-partiel", title: "Mode Partiel — toutes matières", kind: "qcm",
  questions: [
    QUIZZES[0].questions[1], QUIZZES[1].questions[1], QUIZZES[1].questions[2],
    QUIZZES[3].questions[2], QUIZZES[4].questions[1], QUIZZES[4].questions[3],
    QUIZZES[5].questions[1], QUIZZES[6].questions[1], QUIZZES[7].questions[2],
    QUIZZES[8].questions[3], QUIZZES[0].questions[3], QUIZZES[6].questions[3],
  ],
};

/* ================== EXERCICES / ANNALES ================== */

const EXOS = [
  /* --- INFO (8 exercices types) --- */
  { id: "x-i1", subject: "info", title: "Copier une pile", difficulty: "moyen",
    tags: ["piles", "void*"], temps: "15 min",
    enonce: [{ t: "p", v: "Soit P1 une pile d'entiers. Écrire copierPile qui recopie P1 dans P2 en gardant le MÊME ordre. Seuls les sous-programmes de la librairie pile sont autorisés ; une 3e pile est permise." }],
    methode: ["Une pile inverse l'ordre : il faut donc DEUX inversions.", "Vider P1 dans une pile tmp, puis vider tmp dans P1 ET P2 simultanément."],
    indice: "Quand tu dépiles tmp, empile le même pointeur dans P1 (restaurer) ET dans P2 (copier).",
    correction: [
      { t: "code", v: `void copierPile(t_pile *p1, t_pile *p2) {
    t_pile tmp;
    init_pile(&tmp);
    while (!pileVide(p1))           // p1 -> tmp (inverse)
        empiler(&tmp, depiler(p1));
    while (!pileVide(&tmp)) {       // tmp -> p1 ET p2
        void *d = depiler(&tmp);
        empiler(p1, d);
        empiler(p2, d);
    }
}` },
      { t: "p", v: "Deux inversions successives = ordre conservé. P1 est restaurée, P2 reçoit la copie." },
    ]},
  { id: "x-i2", subject: "info", title: "Inverser une file avec une pile", difficulty: "moyen",
    tags: ["files", "piles"], temps: "10 min",
    enonce: [{ t: "p", v: "Soit F une file d'entiers. Écrire inverserFile qui inverse l'ordre de ses éléments, en utilisant une pile." }],
    methode: ["Vider F dans une pile P.", "Vider P dans F : la pile a inversé l'ordre."],
    indice: "Deux boucles while successives : F → P, puis P → F.",
    correction: [
      { t: "code", v: `void inverserFile(t_file *f) {
    t_pile p;
    init_pile(&p);
    while (!fileVide(f))
        empiler(&p, defiler(f));
    while (!pileVide(&p))
        enfiler(f, depiler(&p));
}` },
      { t: "p", v: "La pile (LIFO) inverse l'ordre ; on reverse ensuite dans la file." },
    ]},
  { id: "x-i3", subject: "info", title: "Charger une pile depuis un fichier texte", difficulty: "moyen",
    tags: ["piles", "fichiers", "allocation"], temps: "15 min",
    enonce: [{ t: "p", v: "Charger une pile de caractères depuis un fichier texte. Format : la 1re ligne contient le nombre n d'éléments ; les n lignes suivantes contiennent les caractères, du bas vers le sommet." }],
    methode: ["Ouvrir le fichier en lecture, tester fopen.", "Lire n avec fscanf.", "Pour chaque caractère : allouer un char, le lire, l'empiler."],
    indice: "La pile est générique → elle stocke des void*. Chaque caractère doit donc être dans une zone allouée. Le \" %c\" avec espace ignore les \\n.",
    correction: [
      { t: "code", v: `void chargerPile(t_pile *p, const char *nom) {
    FILE *f = fopen(nom, "r");
    if (f == NULL) { printf("Erreur ouverture\\n"); return; }
    int n;
    fscanf(f, "%d", &n);
    for (int i = 0; i < n; i++) {
        char *c = malloc(sizeof(char));
        fscanf(f, " %c", c);    // l'espace ignore les \\n
        empiler(p, c);
    }
    fclose(f);
}` },
      { t: "p", v: "On alloue une case par caractère (la pile stocke des adresses). Piège : empiler &c d'une variable réutilisée ferait pointer tous les maillons au même endroit." },
    ]},
  { id: "x-i4", subject: "info", title: "Diviser une file en pairs / impairs", difficulty: "facile",
    tags: ["files", "modulo"], temps: "10 min",
    enonce: [{ t: "p", v: "Soit F1 une file d'entiers. La vider en répartissant les pairs dans F2 et les impairs dans F3, en respectant l'ordre." }],
    methode: ["Boucle while tant que F1 non vide.", "Défiler, caster en int*, tester *n % 2, enfiler dans F2 ou F3."],
    indice: "defiler retourne un void* : caste-le en int* pour lire la valeur avec *n.",
    correction: [
      { t: "code", v: `void diviserFile(t_file *f1, t_file *f2, t_file *f3) {
    while (!fileVide(f1)) {
        int *n = (int*) defiler(f1);
        if (*n % 2 == 0) enfiler(f2, n);
        else             enfiler(f3, n);
    }
}` },
      { t: "p", v: "Piège : tester *n % 2 (la valeur), pas n % 2 (l'adresse) !" },
    ]},
  { id: "x-i5", subject: "info", title: "Fusionner deux files en alternant", difficulty: "moyen",
    tags: ["files"], temps: "12 min",
    enonce: [{ t: "p", v: "Soit F1 et F2 deux files. Les fusionner dans F3 en ALTERNANT les éléments. Ex : F1 = X A C U O, F2 = B V E → F3 = X B A V C E U O." }],
    methode: ["Tant que F1 ET F2 non vides : défiler un de chaque, enfiler dans F3.", "Vider ensuite le reste de la file la plus longue."],
    indice: "Trois boucles : une d'alternance, puis deux pour vider le reste de chaque file.",
    correction: [
      { t: "code", v: `void fusionner(t_file *f1, t_file *f2, t_file *f3) {
    while (!fileVide(f1) && !fileVide(f2)) {
        enfiler(f3, defiler(f1));
        enfiler(f3, defiler(f2));
    }
    while (!fileVide(f1)) enfiler(f3, defiler(f1));
    while (!fileVide(f2)) enfiler(f3, defiler(f2));
}` },
      { t: "p", v: "Les deux dernières boucles gèrent le cas des tailles inégales : une seule sera réellement parcourue." },
    ]},
  { id: "x-i6", subject: "info", title: "Somme des éléments d'une file", difficulty: "moyen",
    tags: ["files", "tailleF"], temps: "10 min",
    enonce: [{ t: "p", v: "Écrire sommeFile qui retourne la somme des entiers d'une file F, F devant rester INCHANGÉE." }],
    methode: ["Récupérer tailleF(f).", "Boucler tailleF fois : défiler, ajouter, réenfiler."],
    indice: "Boucle while(!fileVide) impossible ici : on réenfile sans cesse. Utiliser tailleF pour fixer le nombre de tours.",
    correction: [
      { t: "code", v: `int sommeFile(t_file *f) {
    int somme = 0, taille = tailleF(f);
    for (int i = 0; i < taille; i++) {
        int *n = (int*) defiler(f);
        somme += *n;
        enfiler(f, n);   // remettre a la fin
    }
    return somme;
}` },
      { t: "p", v: "Après tailleF tours, la file a fait un tour complet : ordre restauré." },
    ]},
  { id: "x-i7", subject: "info", title: "Allocation : saisie, sauvegarde, chargement de réels", difficulty: "partiel",
    tags: ["allocation", "fichiers", "pointeurs"], temps: "20 min",
    enonce: [{ t: "p", v: "Écrire trois fonctions : saisir une suite de n réels (tableau dynamique), les sauvegarder dans un fichier texte, et les recharger. Le nombre de réels varie." }],
    methode: ["Saisie : malloc d'un tableau de n float, remplir au clavier.", "Sauvegarde : écrire n puis les valeurs.", "Chargement : relire n (par adresse), allouer, relire les valeurs."],
    indice: "Écris le nombre d'éléments en première ligne du fichier : au chargement tu sauras combien allouer. charger doit rendre n via un paramètre int *n.",
    correction: [
      { t: "code", v: `float* saisir(int n) {
    float *t = malloc(n * sizeof(float));
    if (t == NULL) exit(1);
    for (int i = 0; i < n; i++) scanf("%f", &t[i]);
    return t;
}
void sauver(const char *nom, float *t, int n) {
    FILE *f = fopen(nom, "w");
    if (f == NULL) return;
    fprintf(f, "%d\\n", n);
    for (int i = 0; i < n; i++) fprintf(f, "%f\\n", t[i]);
    fclose(f);
}
float* charger(const char *nom, int *n) {
    FILE *f = fopen(nom, "r");
    if (f == NULL) return NULL;
    fscanf(f, "%d", n);                       // n par adresse
    float *t = malloc((*n) * sizeof(float));
    for (int i = 0; i < *n; i++) fscanf(f, "%f", &t[i]);
    fclose(f);
    return t;
}` },
      { t: "p", v: "Le nombre d'éléments se sauvegarde en premier. Ne pas oublier free(t) dans le main." },
    ]},
  { id: "x-i8", subject: "info", title: "TP — Simulation des guichets (t_guichet)", difficulty: "partiel",
    tags: ["structures", "files", "TP"], temps: "25 min",
    enonce: [{ t: "p", v: "Simuler des guichets : chaque guichet a un numéro, un état (ouvert/fermé) et sa propre file d'attente. Définir t_guichet, écrire la fonction qui alloue/initialise un tableau de n guichets, et celle qui ajoute une personne au guichet ouvert ayant la plus petite file." }],
    methode: ["Définir t_guichet avec un champ t_file imbriqué.", "allouer : malloc d'un tableau, initialiser chaque guichet (init_file sur sa file).", "ajouter : parcourir les guichets ouverts, retenir le minimum, y enfiler."],
    indice: "Le champ « file d'attente » est une structure t_file imbriquée. Il faut appeler init_file sur la file de chaque guichet.",
    correction: [
      { t: "code", v: `typedef struct {
    int    numero;
    int    ouvert;     // 1 = ouvert, 0 = ferme
    t_file attente;
} t_guichet;

t_guichet* allouerGuichets(int n) {
    t_guichet *tab = malloc(n * sizeof(t_guichet));
    if (tab == NULL) exit(1);
    for (int i = 0; i < n; i++) {
        tab[i].numero = i + 1;
        tab[i].ouvert = 0;
        init_file(&tab[i].attente);   // chaque file initialisee
    }
    return tab;
}

void ajouterPersonne(t_guichet *tab, int n, void *personne) {
    int idx = -1, minT = 0;
    for (int i = 0; i < n; i++) {
        if (tab[i].ouvert) {
            int t = tailleF(&tab[i].attente);
            if (idx == -1 || t < minT) { idx = i; minT = t; }
        }
    }
    if (idx == -1) { tab[0].ouvert = 1; idx = 0; }
    enfiler(&tab[idx].attente, personne);
}` },
      { t: "p", v: "Un tableau dynamique de structures : malloc + boucle d'initialisation. Chaque sous-structure (la file) doit être initialisée individuellement." },
    ]},

  /* --- MATH --- */
  { id: "x-m1", subject: "math", title: "Calculer un DL", difficulty: "moyen",
    tags: ["DL"], temps: "10 min",
    enonce: [{ t: "p", v: "Déterminer le DL(0, 3) de f(x) = eˣ · cos(x)." }],
    methode: ["Écrire les DL à l'ordre 3 de eˣ et de cos(x).", "Faire le produit, tronquer à l'ordre 3."],
    indice: "eˣ = 1 + x + x²/2 + x³/6 + o(x³) ; cos(x) = 1 − x²/2 + o(x³).",
    correction: [
      { t: "code", v: `eˣ      = 1 + x + x²/2 + x³/6 + o(x³)
cos(x)  = 1 − x²/2 + o(x³)

Produit (termes jusqu'à x³) :
f(x) = 1 + x + x²/2 + x³/6
       − x²/2 − x³/2 + o(x³)
     = 1 + x + 0·x² − x³/3 + o(x³)` },
      { t: "p", v: "DL(0,3) : f(x) = 1 + x − x³/3 + o(x³)." },
    ]},
  { id: "x-m2", subject: "math", title: "Nature d'une intégrale généralisée", difficulty: "moyen",
    tags: ["intégrales"], temps: "10 min",
    enonce: [{ t: "p", v: "Étudier la nature de ∫₁^{+∞} dx / (x² + x)." }],
    methode: ["Chercher un équivalent simple de la fonction en +∞.", "Comparer à une intégrale de Riemann."],
    indice: "En +∞, x² + x ∼ x². Compare donc à ∫ dx/x².",
    correction: [
      { t: "code", v: `En +∞ :  1/(x²+x)  ∼  1/x²

∫₁^∞ dx/x²  : Riemann avec α = 2 > 1
            →  CONVERGE.

Par le critère d'équivalence (fonctions positives),
∫₁^∞ dx/(x²+x) converge également.` },
    ]},
  { id: "x-m3", subject: "math", title: "Résoudre un système AX = B", difficulty: "partiel",
    tags: ["matrices", "Gauss"], temps: "20 min",
    enonce: [{ t: "p", v: "Résoudre par la méthode de Gauss : x + 2y = 5 ; 3x − y = 1." }],
    methode: ["Écrire la matrice augmentée (A | B).", "Échelonner par opérations sur les lignes.", "Remonter pour trouver les inconnues."],
    indice: "L₂ ← L₂ − 3·L₁ élimine x dans la deuxième équation.",
    correction: [
      { t: "code", v: `( 1   2 | 5 )      L₂ ← L₂ − 3L₁
( 3  −1 | 1 )

( 1   2 |  5 )
( 0  −7 | −14 )    →  −7y = −14  →  y = 2

Puis x + 2(2) = 5  →  x = 1.` },
      { t: "p", v: "Solution : x = 1, y = 2." },
    ]},
  { id: "x-m4", subject: "math", title: "Calcul d'un déterminant 3×3", difficulty: "facile",
    tags: ["déterminants"], temps: "8 min",
    enonce: [{ t: "p", v: "Calculer le déterminant de [[2,1,0],[1,3,1],[0,1,2]]." }],
    methode: ["Développer selon une ligne ou colonne avec des zéros (ici 1re ligne)."],
    indice: "La première ligne a un 0 : développe selon elle pour réduire les calculs.",
    correction: [
      { t: "code", v: `Développement selon la 1re ligne :

det = 2·det[[3,1],[1,2]] − 1·det[[1,1],[0,2]] + 0
    = 2·(6−1) − 1·(2−0)
    = 10 − 2 = 8` },
      { t: "p", v: "det = 8 ≠ 0 : la matrice est inversible." },
    ]},
  { id: "x-m5", subject: "math", title: "Limite par équivalent et DL", difficulty: "moyen",
    tags: ["DL", "limites"], temps: "12 min",
    enonce: [{ t: "p", v: "Calculer lim(x→0) (1 − cos x) / (x · sin x)." }],
    methode: ["Repérer la forme indéterminée 0/0.", "Remplacer chaque facteur par son équivalent en 0.", "Simplifier."],
    indice: "1 − cos x ∼ x²/2 et sin x ∼ x au voisinage de 0.",
    correction: [
      { t: "code", v: `Forme 0/0.
Équivalents en 0 :
  1 − cos x ∼ x²/2
  x · sin x ∼ x · x = x²

(1 − cos x)/(x·sin x) ∼ (x²/2)/x² = 1/2

⟹  limite = 1/2` },
      { t: "p", v: "Ici les équivalents suffisent car ce sont des produits/quotients ; pas besoin du DL complet." },
    ]},
  { id: "x-m6", subject: "math", title: "Système 3×3 par la méthode de Gauss", difficulty: "partiel",
    tags: ["systèmes", "Gauss", "matrices"], temps: "20 min",
    enonce: [{ t: "p", v: "Résoudre par le pivot de Gauss : x + y + z = 6 ; 2x + 3y + z = 11 ; x − y + 2z = 5." }],
    methode: ["Écrire la matrice augmentée (A | B).", "Éliminer x dans L₂ et L₃.", "Éliminer y dans L₃, puis remonter."],
    indice: "L₂ ← L₂ − 2L₁ et L₃ ← L₃ − L₁ éliminent x.",
    correction: [
      { t: "code", v: `( 1  1  1 |  6 )
( 2  3  1 | 11 )   L₂ ← L₂ − 2L₁
( 1 −1  2 |  5 )   L₃ ← L₃ − L₁

( 1  1  1 |  6 )
( 0  1 −1 | −1 )
( 0 −2  1 | −1 )   L₃ ← L₃ + 2L₂

( 1  1  1 |  6 )
( 0  1 −1 | −1 )
( 0  0 −1 | −3 )  →  z = 3

y − z = −1 → y = 2 ;  x + y + z = 6 → x = 1` },
      { t: "p", v: "Solution : x = 1, y = 2, z = 3. Un pivot par colonne : la solution est unique." },
    ]},

  /* --- MECA --- */
  { id: "x-c1", subject: "meca", title: "Vitesse en bas d'une pente (TEC)", difficulty: "moyen",
    tags: ["TEC", "énergie"], temps: "12 min",
    enonce: [{ t: "p", v: "Un point matériel de masse m glisse sans frottement sur une pente, partant du repos à une hauteur h. Déterminer sa vitesse v en bas." }],
    methode: ["Appliquer le TEC entre le haut (repos) et le bas.", "Seul le poids travaille (pas de frottement)."],
    indice: "ΔEc = W(poids) ; le travail du poids vaut mgh (descente d'une hauteur h).",
    correction: [
      { t: "code", v: `TEC entre A (haut, v=0) et B (bas, v) :

  ΔEc = W(poids)
  ½mv² − 0 = m·g·h

  ⟹  v = √(2gh)` },
      { t: "p", v: "La vitesse ne dépend que de la hauteur h, pas de la forme de la pente (sans frottement)." },
    ]},
  { id: "x-c2", subject: "meca", title: "Équation d'un oscillateur masse-ressort", difficulty: "moyen",
    tags: ["oscillateur"], temps: "12 min",
    enonce: [{ t: "p", v: "Une masse m attachée à un ressort de raideur k glisse sans frottement. Établir l'équation du mouvement par une méthode énergétique." }],
    methode: ["Écrire l'énergie mécanique Em = Ec + Ep.", "Système conservatif : dEm/dt = 0.", "Simplifier par ẋ."],
    indice: "Em = ½mẋ² + ½kx². Dérive par rapport au temps et annule.",
    correction: [
      { t: "code", v: `Em = ½ m ẋ² + ½ k x²   (conservatif)

dEm/dt = 0 :
  m ẋ ẍ + k x ẋ = 0
  ẋ (m ẍ + k x) = 0

Comme ẋ ≠ 0 en général :
  m ẍ + k x = 0   ⟹   ẍ + (k/m) x = 0` },
      { t: "p", v: "C'est un oscillateur harmonique de pulsation propre ω₀ = √(k/m)." },
    ]},
  { id: "x-c3", subject: "meca", title: "Régime d'un oscillateur amorti", difficulty: "partiel",
    tags: ["amortissement"], temps: "15 min",
    enonce: [{ t: "p", v: "On enregistre θ(t) d'un pendule amorti : la courbe oscille en diminuant d'amplitude. Identifier le régime et donner la forme de θ(t)." }],
    methode: ["Reconnaître le régime à partir de l'allure de la courbe.", "Donner la forme générale de la solution."],
    indice: "Oscillations + atténuation progressive = un seul régime possible.",
    correction: [
      { t: "code", v: `La courbe oscille en s'atténuant
  →  régime PSEUDO-PÉRIODIQUE  (Q > 1/2)

Forme de la solution :
  θ(t) = A·e^(−t/τ)·cos(ω t + φ)

  ω    : pseudo-pulsation (ω < ω₀)
  T = 2π/ω : pseudo-période
  e^(−t/τ) : enveloppe décroissante` },
      { t: "p", v: "L'énergie mécanique décroît : elle est dissipée par les frottements." },
    ]},
  { id: "x-c4", subject: "meca", title: "Équation du mouvement par le PFD", difficulty: "moyen",
    tags: ["PFD", "oscillateur"], temps: "12 min",
    enonce: [{ t: "p", v: "Une masse m sur un plan horizontal est reliée à un ressort de raideur k et subit un frottement fluide f⃗ = −λv⃗. Établir l'équation du mouvement par le principe fondamental de la dynamique." }],
    methode: ["Bilan des forces sur l'axe du mouvement.", "Appliquer le PFD : m·a = ΣF.", "Projeter sur l'axe et réécrire sous forme canonique."],
    indice: "Sur l'axe (Ox) : la force de rappel est −kx, le frottement −λẋ.",
    correction: [
      { t: "code", v: `Bilan sur (Ox) : rappel −kx, frottement −λẋ
(le poids et la réaction se compensent sur Oy)

PFD projeté sur Ox :
  m·ẍ = −k·x − λ·ẋ
  ⟹  m·ẍ + λ·ẋ + k·x = 0
  ⟹  ẍ + (λ/m)·ẋ + (k/m)·x = 0` },
      { t: "p", v: "C'est l'équation d'un oscillateur amorti, de pulsation propre ω₀ = √(k/m)." },
    ]},
  { id: "x-c5", subject: "meca", title: "Interprétation d'une courbe x(t)", difficulty: "facile",
    tags: ["lecture de courbe", "oscillateur"], temps: "10 min",
    enonce: [{ t: "p", v: "On observe une courbe x(t) sinusoïdale dont l'amplitude des oscillations diminue lentement au cours du temps. Identifier le mouvement, et expliquer comment lire la pseudo-période et le comportement de l'énergie." }],
    methode: ["Relier l'allure de la courbe à un type de mouvement.", "Indiquer où se lisent les grandeurs caractéristiques."],
    indice: "Sinusoïde + amplitude qui décroît = un seul type d'oscillateur.",
    correction: [
      { t: "code", v: `Courbe sinusoïdale à amplitude décroissante
  →  oscillateur amorti, régime pseudo-périodique

Pseudo-période T : durée entre deux maxima
  successifs (ou deux passages par 0 dans le
  même sens).
Énergie : l'amplitude décroît ⟹ Em décroît
  (dissipée par les frottements).` },
      { t: "p", v: "L'enveloppe de la courbe suit une décroissance exponentielle en e^(−t/τ) : τ est le temps caractéristique d'amortissement." },
    ]},

  /* --- ELEC (5 exercices) --- */
  { id: "x-e1", subject: "elec", title: "Pont diviseur de tension", difficulty: "facile",
    tags: ["diviseur"], temps: "6 min",
    enonce: [{ t: "p", v: "Deux résistances R₁ = 1 kΩ et R₂ = 3 kΩ en série, alimentées par U = 12 V. Calculer la tension U₂ aux bornes de R₂ (sortie à vide)." }],
    methode: ["Appliquer directement la formule du diviseur de tension."],
    indice: "U₂ = U · R₂/(R₁+R₂).",
    correction: [
      { t: "code", v: `U₂ = U · R₂/(R₁+R₂)
   = 12 · 3000/(1000+3000)
   = 12 · 3/4 = 9 V` },
      { t: "p", v: "La tension se répartit proportionnellement aux résistances." },
    ]},
  { id: "x-e2", subject: "elec", title: "Résistance équivalente", difficulty: "facile",
    tags: ["lois", "associations"], temps: "8 min",
    enonce: [{ t: "p", v: "Calculer la résistance équivalente vue par le générateur : R₁ = 6 Ω en série avec l'association parallèle de R₂ = 4 Ω et R₃ = 4 Ω." }],
    methode: ["Calculer d'abord le parallèle R₂ // R₃.", "Ajouter R₁ en série."],
    indice: "Parallèle de deux résistances égales : R/2.",
    correction: [
      { t: "code", v: `R₂ // R₃ = R₂·R₃/(R₂+R₃) = 16/8 = 2 Ω

R_eq = R₁ + (R₂//R₃) = 6 + 2 = 8 Ω` },
      { t: "p", v: "On simplifie toujours les blocs parallèles avant d'additionner les séries." },
    ]},
  { id: "x-e3", subject: "elec", title: "Filtre RC — fréquence de coupure", difficulty: "moyen",
    tags: ["filtres"], temps: "10 min",
    enonce: [{ t: "p", v: "Un filtre RC passe-bas a R = 10 kΩ et C = 100 nF. Donner sa fonction de transfert, sa pulsation puis sa fréquence de coupure." }],
    methode: ["Écrire H(jω) du passe-bas RC.", "ω_c = 1/(RC), puis f_c = ω_c/(2π)."],
    indice: "ω_c = 1/(RC). Attention aux unités : 10 kΩ = 10⁴ Ω, 100 nF = 10⁻⁷ F.",
    correction: [
      { t: "code", v: `H(jω) = 1 / (1 + jRCω)

ω_c = 1/(RC) = 1/(10⁴ × 10⁻⁷) = 1000 rad/s
f_c = ω_c/(2π) ≈ 159 Hz` },
      { t: "p", v: "Au-delà de f_c, le filtre atténue le signal à −20 dB/décade." },
    ]},
  { id: "x-e4", subject: "elec", title: "Gain d'un montage AOP", difficulty: "moyen",
    tags: ["AOP"], temps: "10 min",
    enonce: [{ t: "p", v: "Un AOP idéal est monté en amplificateur non inverseur avec R₁ = 2 kΩ (vers la masse) et R₂ = 18 kΩ (contre-réaction). Calculer le gain et Vs si Ve = 0,5 V." }],
    methode: ["Vérifier la rétroaction sur l'entrée − (régime linéaire).", "Appliquer la formule du gain non inverseur."],
    indice: "Gain = 1 + R₂/R₁.",
    correction: [
      { t: "code", v: `Rétroaction sur l'entrée −  →  régime linéaire.

Gain = 1 + R₂/R₁ = 1 + 18/2 = 10
Vs = Gain · Ve = 10 × 0,5 = 5 V` },
      { t: "p", v: "Le montage non inverseur amplifie sans changer le signe de la tension." },
    ]},
  { id: "x-e5", subject: "elec", title: "Lecture d'un oscillogramme", difficulty: "moyen",
    tags: ["méthode TP", "régime sinusoïdal"], temps: "10 min",
    enonce: [{ t: "p", v: "Sur un oscilloscope, un signal sinusoïdal a une amplitude crête de 4 divisions (1 V/division) et une période de 5 divisions (0,5 ms/division). Donner U_max, U_eff, la période et la fréquence." }],
    methode: ["Amplitude = nb divisions × calibre vertical.", "Période = nb divisions × calibre horizontal.", "f = 1/T ; U_eff = U_max/√2."],
    indice: "Multiplier le nombre de divisions par le calibre de chaque axe.",
    correction: [
      { t: "code", v: `U_max = 4 div × 1 V/div = 4 V
U_eff = U_max/√2 ≈ 2,83 V

T = 5 div × 0,5 ms/div = 2,5 ms
f = 1/T = 1/(2,5·10⁻³) = 400 Hz` },
      { t: "p", v: "Toujours partir des calibres affichés sur l'oscilloscope pour convertir les divisions en grandeurs physiques." },
    ]},
  { id: "x-e6", subject: "elec", title: "Montage inverseur & saturation", difficulty: "moyen",
    tags: ["AOP", "saturation"], temps: "12 min",
    enonce: [{ t: "p", v: "Un AOP idéal monté en inverseur a R₁ = 1 kΩ (entrée) et R₂ = 10 kΩ (contre-réaction), alimenté en ±15 V. Calculer Vs pour Ve = −0,8 V, puis pour Ve = −2,5 V. Conclure." }],
    methode: ["Vérifier la contre-réaction sur l'entrée − (régime linéaire a priori).", "Appliquer Vs = −(R₂/R₁)·Ve.", "Comparer Vs aux tensions d'alimentation : si |Vs| dépasse, l'AOP sature."],
    indice: "Le gain est −R₂/R₁ = −10. Si le résultat dépasse ±15 V, la sortie est limitée à ±Vsat.",
    correction: [
      { t: "code", v: `Gain = −R₂/R₁ = −10

Ve = −0,8 V : Vs = −10 × (−0,8) = +8 V
   8 V < 15 V  →  régime linéaire, Vs = 8 V

Ve = −2,5 V : Vs = −10 × (−2,5) = +25 V
   25 V > 15 V  →  SATURATION : Vs = +Vsat ≈ +15 V` },
      { t: "p", v: "Tant que la valeur calculée reste dans ±Vsat, l'AOP est linéaire. Au-delà, la sortie est écrêtée : c'est la saturation." },
    ]},
  { id: "x-e7", subject: "elec", title: "Trigger de Schmitt — seuils de basculement", difficulty: "partiel",
    tags: ["AOP", "Schmitt"], temps: "18 min",
    enonce: [{ t: "p", v: "Un comparateur à hystérésis (trigger de Schmitt non inverseur) a sa sortie rebouclée sur l'entrée + par un pont R₁ = 10 kΩ (vers Ve) et R₂ = 20 kΩ (vers Vs). La sortie sature à ±Vsat = ±12 V. Déterminer les deux seuils de basculement." }],
    methode: ["La rétroaction arrive sur + : régime SATURÉ (pas linéaire).", "La sortie bascule quand V⁺ change de signe.", "Exprimer V⁺ par superposition de Ve et Vs, l'annuler pour trouver le seuil."],
    indice: "V⁺ = 0 au basculement. V⁺ dépend de Ve et de Vs (= ±Vsat). On obtient un seuil pour chaque état de Vs.",
    correction: [
      { t: "code", v: `Rétroaction sur + → comparateur à hystérésis.
Basculement quand V⁺ = 0.

V⁺ = Ve·R₂/(R₁+R₂) + Vs·R₁/(R₁+R₂) = 0
⟹ Ve_seuil = −Vs·R₁/R₂

Vs = +12 V : seuil bas  = −12·(10/20) = −6 V
Vs = −12 V : seuil haut = +12·(10/20) = +6 V` },
      { t: "p", v: "Les deux seuils (−6 V et +6 V) sont différents : c'est l'hystérésis. Cet écart immunise le montage contre le bruit autour du basculement." },
    ]},
  { id: "x-e8", subject: "elec", title: "Lire un diagramme de Bode", difficulty: "moyen",
    tags: ["filtres", "Bode", "méthode TP"], temps: "12 min",
    enonce: [{ t: "p", v: "Un diagramme de Bode montre : un gain constant à 0 dB jusqu'à 1 kHz, puis une chute régulière de −40 dB/décade. Identifier le type de filtre, son ordre, sa fréquence de coupure, et le gain attendu à 10 kHz." }],
    methode: ["Allure plate puis chute → type de filtre.", "Pente → ordre.", "Coupure = passage à −3 dB.", "Extrapoler le gain avec la pente."],
    indice: "Une décade = facteur 10 en fréquence. De 1 kHz à 10 kHz, on parcourt exactement une décade.",
    correction: [
      { t: "code", v: `Gain plat puis chute  →  filtre PASSE-BAS
Pente −40 dB/décade   →  ordre 2
Coupure : à 1 kHz (départ de la chute, −3 dB)

De 1 kHz à 10 kHz = 1 décade
Gain à 10 kHz ≈ 0 − 40 = −40 dB` },
      { t: "p", v: "Méthode : type (allure) → ordre (pente) → coupure (−3 dB) → extrapolation du gain." },
    ]},
  { id: "x-e9", subject: "elec", title: "Déphasage d'un filtre RC", difficulty: "moyen",
    tags: ["filtres", "phase", "régime sinusoïdal"], temps: "12 min",
    enonce: [{ t: "p", v: "Pour un filtre passe-bas RC, donner l'expression du déphasage φ entre la sortie et l'entrée, puis sa valeur à très basse fréquence, à la fréquence de coupure, et à très haute fréquence." }],
    methode: ["φ = arg(H) avec H = 1/(1+jRCω).", "arg du dénominateur change de signe.", "Évaluer aux trois fréquences clés."],
    indice: "arg(1/(1+jx)) = −arctan(x), avec x = RCω = ω/ω_c.",
    correction: [
      { t: "code", v: `H = 1/(1 + jRCω)
φ = arg(H) = −arctan(RCω) = −arctan(ω/ω_c)

ω ≪ ω_c  :  φ → 0°
ω = ω_c   :  φ = −arctan(1) = −45°
ω ≫ ω_c  :  φ → −90°` },
      { t: "p", v: "Un passe-bas du 1er ordre déphase de 0° à −90°, en passant par −45° exactement à la fréquence de coupure." },
    ]},
  { id: "x-e10", subject: "elec", title: "Lois des mailles et des nœuds", difficulty: "facile",
    tags: ["lois", "Kirchhoff", "cours"], temps: "10 min",
    enonce: [{ t: "p", v: "Un générateur E = 12 V alimente deux résistances R₁ = 200 Ω et R₂ = 400 Ω en série. Calculer le courant dans le circuit, puis la tension aux bornes de chaque résistance. Vérifier la loi des mailles." }],
    methode: ["Loi des mailles : E = U₁ + U₂.", "En série, le même courant traverse tout.", "Loi d'Ohm sur chaque résistance."],
    indice: "En série, R_eq = R₁ + R₂, et I = E / R_eq.",
    correction: [
      { t: "code", v: `R_eq = R₁ + R₂ = 200 + 400 = 600 Ω
I = E / R_eq = 12 / 600 = 0,02 A = 20 mA

U₁ = R₁·I = 200 × 0,02 = 4 V
U₂ = R₂·I = 400 × 0,02 = 8 V

Vérif. maille : U₁ + U₂ = 4 + 8 = 12 V = E  ✓` },
      { t: "p", v: "La somme des tensions sur la maille vaut bien la tension du générateur : la loi des mailles est respectée." },
    ]},
  { id: "x-e11", subject: "elec", title: "Régime transitoire d'un circuit RC", difficulty: "moyen",
    tags: ["condensateur", "TD"], temps: "12 min",
    enonce: [{ t: "p", v: "Un condensateur C = 10 µF se charge à travers une résistance R = 10 kΩ sous une tension E = 5 V. Donner la constante de temps, la tension à t = τ, et la durée pratique de fin de charge." }],
    methode: ["Constante de temps τ = R·C.", "Loi de charge u(t) = E·(1 − e^(−t/τ)).", "Fin de charge pratique : 5τ."],
    indice: "À t = τ, le facteur (1 − e^(−1)) vaut environ 0,63.",
    correction: [
      { t: "code", v: `τ = R·C = 10·10³ × 10·10⁻⁶ = 0,1 s

u(τ) = E·(1 − e^(−1)) = 5 × 0,63 ≈ 3,16 V

Fin de charge : 5τ = 0,5 s` },
      { t: "p", v: "À une constante de temps, le condensateur a atteint 63 % de la tension finale. Après 5τ, la charge est considérée terminée." },
    ]},
  { id: "x-e12", subject: "elec", title: "Identifier un filtre par sa transfert", difficulty: "moyen",
    tags: ["filtres", "Bode", "contrôle"], temps: "13 min",
    enonce: [{ t: "p", v: "Un circuit a pour fonction de transfert H(jω) = jRCω / (1 + jRCω). Déterminer le type de filtre, son ordre, sa fréquence de coupure et le déphasage à très basse fréquence." }],
    methode: ["Étudier H quand ω → 0 et ω → ∞.", "Le degré du dénominateur donne l'ordre.", "Coupure : RCω = 1."],
    indice: "Quand ω → 0, le numérateur jRCω → 0 ; quand ω → ∞, H → 1.",
    correction: [
      { t: "code", v: `ω → 0 :  H → 0        (basses fréquences coupées)
ω → ∞ :  H → 1        (hautes fréquences passent)
⟹ filtre PASSE-HAUT, ordre 1

Coupure : RCω_c = 1  →  ω_c = 1/(RC)
                        f_c = 1/(2πRC)

φ = arg(H). À très basse fréquence : φ → +90°` },
      { t: "p", v: "Un passe-haut du 1er ordre déphase de +90° (BF) vers 0° (HF), en passant par +45° à la coupure." },
    ]},
  { id: "x-e13", subject: "elec", title: "Montage non-inverseur — lecture et gain", difficulty: "partiel",
    tags: ["AOP", "lecture de courbe"], temps: "15 min",
    enonce: [{ t: "p", v: "Un AOP idéal en montage non-inverseur a R₁ = 2 kΩ (de la masse vers −) et R₂ = 8 kΩ (de − vers la sortie). On applique un signal triangulaire d'amplitude 1 V. Donner le gain, l'amplitude de sortie, et dire si la sortie sature sachant que l'alimentation est ±15 V." }],
    methode: ["Vérifier la contre-réaction sur − (régime linéaire).", "Gain non-inverseur = 1 + R₂/R₁.", "Comparer l'amplitude de sortie à Vsat."],
    indice: "Le gain d'un montage non-inverseur est 1 + R₂/R₁.",
    correction: [
      { t: "code", v: `Contre-réaction sur − → régime linéaire.

Gain = 1 + R₂/R₁ = 1 + 8/2 = 5

Amplitude de sortie = 5 × 1 V = 5 V
5 V < 15 V  →  pas de saturation

Vs reste un signal triangulaire, amplifié ×5.` },
      { t: "p", v: "Le montage non-inverseur amplifie sans changer le signe ni la forme du signal. Tant que la sortie reste sous ±Vsat, l'AOP fonctionne en linéaire." },
    ]},
  /* --- ELEC : exercices extraits des DS2 Électronique S2 --- */
  { id: "x-e14", subject: "elec", title: "Thévenin & Norton — sources indépendantes", difficulty: "partiel",
    tags: ["Thévenin", "Norton", "annale"], temps: "20 min",
    enonce: [{ t: "p", v: "DS2 2021-2022, Ex.1. Circuit : générateur 3 V, résistances 6 Ω, 5 Ω et 2 Ω, source de courant 1 A, charge Rc = 3 Ω entre A et B. (1) Déterminer Rth et Eth. (2) Déterminer Rn et In (orienté A→B). (3) En déduire le courant io dans Rc." }],
    methode: ["Rth : éteindre les sources indépendantes (tension → court-circuit, courant → circuit ouvert), calculer la résistance vue de A-B.", "Eth : tension à vide UAB, charge Rc retirée, sources actives.", "In : courant de court-circuit entre A et B ; Rn = Rth.", "io : diviseur de courant entre Rn et Rc."],
    indice: "Rn = Rth. Pour io, applique le diviseur de courant io = Rn/(Rn+Rc) × In.",
    correction: [
      { t: "schema", name: "thevenin", legend: "Modèle de Thévenin : Eth en série avec Rth." },
      { t: "code", v: `Rth : sources indépendantes éteintes  =>  Rth = 2 Ohm
Eth : la résistance 2 Ohm est traversée par 1 A
      Eth = -2 x 1 = -2 V
In  : court-circuit A-B  =>  In = -1 A     Rn = Rth = 2 Ohm` },
      { t: "formula", tex: "i_o = \\frac{R_n}{R_n + R_c} \\cdot I_n", note: "Diviseur de courant." },
      { t: "code", v: `io = 2/(2+3) x (-1) = -0,4 A` },
      { t: "note", kind: "warn", title: "Piège classique", v: "Oublier d'éteindre les sources avant de calculer Rth, et perdre le signe de In (l'orientation A→B est imposée)." },
      { t: "note", kind: "info", title: "Pour réviser", v: "Fiche liée : Lois fondamentales (e-lois). Formule liée : diviseur de courant." },
    ]},
  { id: "x-e15", subject: "elec", title: "Théorème de Thévenin — sources liées", difficulty: "difficile",
    tags: ["Thévenin", "sources liées", "annale"], temps: "20 min",
    enonce: [{ t: "p", v: "DS2 2021-2022, Ex.2. Source de courant indépendante Io = 2 A, résistances 5 Ω et 3 Ω, et une source de tension LIÉE de valeur Io (en volts). Charge Rc = 10 Ω. Déterminer Rth et Eth du générateur de Thévenin à gauche de A et B." }],
    methode: ["Une source LIÉE ne s'éteint jamais.", "Rth : éteindre seulement les sources indépendantes, brancher un générateur de test (tension V, courant I) → Rth = V/I.", "Eth : tension à vide UAB, toutes sources actives (y compris la source liée)."],
    indice: "C'est tout le piège : on garde la source liée active et on injecte un générateur de test pour obtenir Rth.",
    correction: [
      { t: "code", v: `Rth : on éteint la source indépendante (2 A -> circuit ouvert)
et on injecte un générateur de test 1 V.
La source liée vaut U = io ; or ici io = 0, donc U = 0 V :
on la remplace par un fil.
Le test 1 V ne voit plus qu'une résistance de 3 Ohm :
  I = 1/3 A   =>   Rth = V/I = 3 Ohm

Eth : tension à vide UAB, toutes sources actives.
La résistance de 3 Ohm côté A ne voit aucun courant (charge
retirée) : on la retire. La source liée vaut U = io = 2 V.
  => Eth = 2 V` },
      { t: "note", kind: "warn", title: "Piège classique", v: "Éteindre une source liée comme une source indépendante : c'est faux. Une source liée dépend d'une grandeur du circuit, elle reste toujours active." },
      { t: "note", kind: "info", title: "Pour réviser", v: "Fiche liée : Lois fondamentales (e-lois) et Méthode (e-methode)." },
    ]},
  { id: "x-e16", subject: "elec", title: "Trigger de Schmitt — seuils VH et VL", difficulty: "partiel",
    tags: ["AOP", "Schmitt", "annale"], temps: "15 min",
    enonce: [{ t: "p", v: "DS2 2021-2022, Ex.3. Comparateur inverseur à hystérésis : AOP idéal, Vin sur l'entrée −, R2 = 2 kΩ de la sortie vers l'entrée +, R1 = 1 kΩ de + à la masse, Vsat = 14 V. Déterminer les seuils de basculement VH et VL." }],
    methode: ["Pas de contre-réaction sur − → l'AOP est saturé (±Vsat).", "V+ se lit avec le diviseur de tension : V+ = R1/(R1+R2) × Vout.", "Le basculement a lieu quand V+ = V− = Vin."],
    indice: "VH se calcule avec Vout = +Vsat, VL avec Vout = −Vsat.",
    correction: [
      { t: "schema", name: "aop-schmitt", legend: "La réaction sur l'entrée + crée l'hystérésis à deux seuils." },
      { t: "formula", tex: "V_H = \\frac{R_1}{R_1 + R_2} \\cdot V_{sat}", note: "Seuil haut (Vout = +Vsat)." },
      { t: "code", v: `VH = 1/(1+2) x 14 = 4,7 V
VL = -1/(1+2) x 14 = -4,7 V` },
      { t: "note", kind: "warn", title: "Piège classique", v: "Oublier le facteur R1/(R1+R2) du diviseur, ou confondre VH et VL. Les deux seuils sont symétriques ici." },
      { t: "note", kind: "info", title: "Pour réviser", v: "Fiche liée : Amplificateur opérationnel (e-aop). Formule liée : seuils du trigger de Schmitt." },
    ]},
  { id: "x-e17", subject: "elec", title: "Filtre RC passe-haut — H(jω) et coupure", difficulty: "moyen",
    tags: ["filtres", "annale"], temps: "20 min",
    enonce: [{ t: "p", v: "DS2 2020-2021, Ex.1. Filtre : Vin, R1 et C en série, R2 en sortie. R1 = 9R, R2 = R, R = 10³ Ω, C = 10⁻⁶ F. (1) Nature du filtre via les schémas équivalents BF/HF. (2) H(jω) sous forme ja/(1+jb). (3) Pulsation de coupure ωc." }],
    methode: ["BF : C est un interrupteur ouvert → Vout = 0. HF : C est un fil → Vout ≠ 0 → filtre passe-haut.", "Pont diviseur : H = R2/(R1+R2+Zc) avec Zc = 1/(jCω).", "À la coupure : |H(ωc)| = |H|max / √2."],
    indice: "Avec R1 = 9R et R2 = R, H se simplifie en jRCω/(1+10jRCω).",
    correction: [
      { t: "schema", name: "rc-passehaut", legend: "Passe-haut RC : C en série, R à la masse, sortie sur R." },
      { t: "code", v: `BF : Vout = 0   /   HF : Vout != 0   =>  passe-haut, passif, 1er ordre
H(jω) = jRCω / (1 + 10 jRCω)   =>  a = RCω,  b = 10 RCω
ωc = 1/(10 RC) = 100 rad/s` },
      { t: "formula", tex: "Z_c = \\frac{1}{jC\\omega}", note: "Impédance d'un condensateur." },
      { t: "note", kind: "warn", title: "Piège classique", v: "Inverser le comportement du condensateur : en BF il est OUVERT, en HF il est un FIL. Une erreur ici fausse toute la nature du filtre." },
      { t: "note", kind: "info", title: "Pour réviser", v: "Fiche liée : Filtres & Bode (e-filtre). Formule liée : impédance d'un condensateur." },
    ]},
  { id: "x-e18", subject: "elec", title: "Diagramme de Bode d'un passe-haut", difficulty: "moyen",
    tags: ["Bode", "lecture de courbe", "annale"], temps: "15 min",
    enonce: [{ t: "p", v: "DS2 2020-2021, Ex.1 (suite). Pour le filtre passe-haut RC du 1er ordre (ωc = 100 rad/s), tracer les diagrammes asymptotiques de Bode en gain et en phase, et placer la pente ainsi que le point −3 dB." }],
    methode: ["Gain : pente +20 dB/décade tant que ω < ωc, puis plateau à 0 dB.", "Le point de coupure est à −3 dB sous le plateau.", "Phase : +π/2 en BF, 0 en HF, +π/4 à ωc."],
    indice: "Un passe-haut du 1er ordre monte de +20 dB/décade puis devient plat.",
    correction: [
      { t: "schema", name: "bode-passehaut", legend: "Gain : +20 dB/décade puis plateau 0 dB ; coupure à -3 dB en ωc." },
      { t: "formula", tex: "G_{dB} = 20 \\log |H|", note: "Gain en décibels." },
      { t: "p", v: "Gain : droite à +20 dB/décade pour ω < ωc, plateau à 0 dB pour ω > ωc, raccord arrondi à −3 dB en ωc. Phase : +π/2 en basse fréquence, qui décroît vers 0, en passant par +π/4 à la pulsation de coupure." },
      { t: "note", kind: "warn", title: "Piège classique", v: "Confondre la pente du gain (asymptote) et l'écart réel de −3 dB à la coupure, ou oublier de préciser le sens de variation de la phase." },
      { t: "note", kind: "info", title: "Pour réviser", v: "Fiche liée : Lire une courbe de Bode (e-bode). Formule liée : gain en décibels." },
    ]},
  { id: "x-e19", subject: "elec", title: "Valeur moyenne & valeur efficace d'un créneau", difficulty: "moyen",
    tags: ["signal", "annale"], temps: "15 min",
    enonce: [{ t: "p", v: "DS2 2020-2021, Ex.2. Signal créneau périodique T = 4 s : 3 V pendant 2 s, puis −1 V pendant 2 s. Calculer la valeur moyenne ⟨s(t)⟩ et la valeur efficace S (3 chiffres significatifs)." }],
    methode: ["Valeur moyenne = aire algébrique sur une période, divisée par T.", "Valeur efficace = racine de la moyenne du carré du signal."],
    indice: "Pour S, élève d'abord le signal au carré : 3² = 9 et (−1)² = 1.",
    correction: [
      { t: "code", v: `⟨s(t)⟩ = (1/4) x (3x2 + (-1)x2) = (1/4)(6-2) = 1 V
S = racine[ (1/4) x (3²x2 + (-1)²x2) ]
  = racine[ (1/4) x 20 ] = racine(5) ≈ 2,24 V` },
      { t: "formula", tex: "S = \\sqrt{\\frac{1}{T} \\int_{0}^{T} s^2(t)\\, dt}", note: "Valeur efficace (RMS)." },
      { t: "note", kind: "warn", title: "Piège classique", v: "Confondre valeur moyenne et valeur efficace, ou oublier d'élever le signal au carré avant de moyenner." },
      { t: "note", kind: "info", title: "Pour réviser", v: "Fiche liée : Régime sinusoïdal (e-sinus). Formule liée : valeur efficace." },
    ]},
  { id: "x-e20", subject: "elec", title: "Séries de Fourier d'un signal pair", difficulty: "partiel",
    tags: ["Fourier", "signal", "annale"], temps: "20 min",
    enonce: [{ t: "p", v: "DS2 2020-2021, Ex.2 (suite). Pour le même signal créneau (pair, T = 4 s), justifier que Bn = 0, puis donner l'expression de An et calculer A0, A1 et A2." }],
    methode: ["Signal pair → Bn = 0 (aucune composante en sinus).", "An = (4/T)∫₀^(T/2) s(t)cos(nωt)dt, intégrale découpée sur les deux paliers.", "A0 est la valeur moyenne du signal."],
    indice: "Le résultat de l'intégration est An = (8/nπ) × sin(nπ/2).",
    correction: [
      { t: "formula", tex: "A_n = \\frac{8}{n\\pi} \\sin\\left(\\frac{n\\pi}{2}\\right)", note: "Coefficients du créneau pair." },
      { t: "code", v: `Bn = 0   (signal pair, pas de composante impaire)
A0 = ⟨s(t)⟩ = 1 V
A1 = (8/π) x sin(π/2) = 8/π ≈ 2,55
A2 = (8/2π) x sin(π) = 0` },
      { t: "note", kind: "warn", title: "Piège classique", v: "Ne pas exploiter la parité (qui annule Bn et simplifie An) ; oublier que sin(nπ/2) = 0 pour tout n pair." },
      { t: "note", kind: "info", title: "Pour réviser", v: "Fiche liée : Régime sinusoïdal (e-sinus). Notion liée : décomposition en série de Fourier." },
    ]},
  { id: "x-e21", subject: "elec", title: "Condensateur de découplage — rôle", difficulty: "facile",
    tags: ["filtres", "annale"], temps: "8 min",
    enonce: [{ t: "p", v: "DS2 2020-2021, Ex.2. Dans un circuit comportant un filtre passe-bas, un condensateur est relié à la masse. Comment s'appelle ce condensateur et quel est son rôle ?" }],
    methode: ["Repérer la position du condensateur : relié à la masse.", "Relier son rôle au comportement du condensateur en haute fréquence."],
    indice: "En haute fréquence, le condensateur se comporte comme un fil : il court-circuite les HF vers la masse.",
    correction: [
      { t: "schema", name: "decouplage", legend: "Condensateur de découplage : les hautes fréquences partent à la masse." },
      { t: "p", v: "C'est un condensateur de découplage. Il filtre les hautes fréquences en les envoyant à la masse, et laisse passer les basses fréquences vers le reste du circuit." },
      { t: "note", kind: "warn", title: "Piège classique", v: "Le confondre avec un condensateur de LIAISON : celui-ci est placé EN SÉRIE et sert à bloquer la composante continue, pas à filtrer les HF." },
      { t: "note", kind: "info", title: "Pour réviser", v: "Fiche liée : Filtres & Bode (e-filtre)." },
    ]},
  { id: "x-e22", subject: "elec", title: "Théorème de Millman — potentiel d'un nœud", difficulty: "moyen",
    tags: ["Millman", "annale"], temps: "15 min",
    enonce: [{ t: "p", v: "DS1 2021-2022, Ex.2. R1 = 100 Ω relié à V1 = 10 V, source de courant i2 = 2 A, R3 = 300 Ω vers la masse, R4 = 400 Ω relié à 4 V. Déterminer le potentiel VA par le théorème de Millman, puis le courant i3 dans R3." }],
    methode: ["Millman : VA = (somme des V/R des branches + courants injectés) / (somme des 1/R).", "Soigner le signe de chaque tension selon son orientation.", "i3 s'obtient ensuite par la loi d'Ohm sur R3."],
    indice: "Une source de courant s'ajoute directement au numérateur ; une branche reliée à la masse apporte 0/R.",
    correction: [
      { t: "formula", tex: "V_A = \\frac{\\sum \\frac{V_k}{R_k} + \\sum I_k}{\\sum \\frac{1}{R_k}}", note: "Théorème de Millman." },
      { t: "code", v: `VA = ( -10/100 + 2 + 0/300 + 4/400 ) / ( 1/100 + 1/300 + 1/400 )
   = 1,91 / 0,01583 = 121 V
i3 = (VA - 0) / R3 = 121 / 300 = 0,4 A` },
      { t: "note", kind: "warn", title: "Piège classique", v: "Oublier une branche au numérateur, ou se tromper de signe : une source vue en sens inverse change le signe de son terme V/R." },
      { t: "note", kind: "info", title: "Pour réviser", v: "Fiche liée : Lois fondamentales (e-lois) et Méthode (e-methode). Formule liée : théorème de Millman." },
    ]},
  { id: "x-e23", subject: "elec", title: "Théorème de superposition", difficulty: "moyen",
    tags: ["superposition", "annale"], temps: "18 min",
    enonce: [{ t: "p", v: "DS1 2021-2022, Ex.3. Un circuit comporte une source de 24 V et une source de 12 V (résistances 8, 4, 4, 3 Ω). Déterminer le potentiel VA aux bornes de la résistance de 3 Ω par le théorème de superposition." }],
    methode: ["Garder une seule source active, éteindre les autres (tension → court-circuit, courant → circuit ouvert).", "Calculer la contribution de chaque source séparément.", "Additionner les contributions."],
    indice: "Avec la source de 24 V seule, la branche supérieure se retrouve coincée entre deux masses.",
    correction: [
      { t: "code", v: `Source 12 V seule : 3 Ohm // 4 Ohm = 12/7 ≈ 1,714 Ohm
  Diviseur de tension : VA1 = 1,714/(1,714+4) x 12 = 3,6 V
Source 24 V seule : branche coincée entre deux masses,
  retirée  =>  VA2 = 0 V
VA = VA1 + VA2 = 3,6 + 0 = 3,6 V` },
      { t: "note", kind: "warn", title: "Piège classique", v: "Oublier d'éteindre une source, ou oublier qu'une source de tension éteinte devient un court-circuit (pas un circuit ouvert)." },
      { t: "note", kind: "info", title: "Pour réviser", v: "Fiche liée : Lois fondamentales (e-lois) et Méthode (e-methode)." },
    ]},
  { id: "x-e24", subject: "elec", title: "Méthode des nœuds avec source liée", difficulty: "partiel",
    tags: ["nœuds", "annale"], temps: "20 min",
    enonce: [{ t: "p", v: "DS1 2021-2022, Ex.4. Un circuit comporte une source dépendante de courant 2io, une source de 2 A et des résistances 3, 2, 5 et 4 Ω. Déterminer les potentiels VA, VB et VC par la méthode des nœuds." }],
    methode: ["Écrire une loi des nœuds par nœud de potentiel inconnu.", "Remplacer chaque courant par son expression en potentiels (loi d'Ohm).", "Résoudre le système (ici 3 équations, 3 inconnues)."],
    indice: "La source 2io est une source dépendante de courant commandée en courant : 3 inconnues → il faut 3 équations.",
    correction: [
      { t: "code", v: `Loi des nœuds en A, B, C + loi d'Ohm => système :
  -5 VA + 3 VB + 3 VC = 0
        19 VB - 4 VC = 0
   5 VA + 2 VB - 7 VC = -20
Résolu à la calculatrice :
  VA = 4,93 V    VB = 1,43 V    VC = 6,79 V` },
      { t: "note", kind: "warn", title: "Piège classique", v: "Oublier d'exprimer la source liée en fonction des potentiels, ou poser un mauvais nombre d'équations (il en faut autant que de potentiels inconnus)." },
      { t: "note", kind: "info", title: "Pour réviser", v: "Fiche liée : Lois fondamentales (e-lois) et Méthode (e-methode)." },
    ]},
];

/* ============ CRITÈRES INTERACTIFS (exos info) ============ */
/* Vérification heuristique par mots-clés : aide pédagogique, pas une note. */
const EXO_INTERACTIVE = {
  "x-i1": {
    func: "copierPile",
    criteres: [
      { l: "Utilise une pile temporaire", k: ["tmp", "temp", "init_pile", "t_pile"] },
      { l: "Dépile la pile source", k: ["depiler"] },
      { l: "Ré-empile les éléments", k: ["empiler"] },
      { l: "Recopie aussi dans la 2e pile (P2)", k: ["p2"], w: ["empiler"] },
      { l: "Gère le cas pile vide (boucle while)", k: ["pilevide", "!pilevide"], w: ["while", "vide"] },
    ],
    conseil: "Fais DEUX inversions : une pour copier, une pour que P1 retrouve son ordre initial.",
    erreur: "Vider P1 sans la reconstituer — à la fin, P1 doit être intacte.",
    fiches: ["i-pf"],
  },
  "x-i2": {
    func: "inverserFile",
    criteres: [
      { l: "Utilise une pile intermédiaire", k: ["pile", "empiler", "init_pile"] },
      { l: "Défile la file dans la pile", k: ["defiler"], w: ["while"] },
      { l: "Ré-enfile les éléments depuis la pile", k: ["enfiler"], w: ["depiler"] },
      { l: "Gère le cas file vide", k: ["filevide", "!filevide"], w: ["while", "vide"] },
    ],
    conseil: "Défiler dans une pile puis dépiler vers la file : la pile inverse l'ordre.",
    erreur: "Défiler puis ré-enfiler directement ne change pas l'ordre — il faut passer par une pile.",
    fiches: ["i-pf"],
  },
  "x-i3": {
    func: "chargerPile",
    criteres: [
      { l: "Ouvre le fichier (fopen)", k: ["fopen"] },
      { l: "Vérifie le retour de fopen (NULL)", k: ["null"], w: ["fopen"] },
      { l: "Lit le fichier (fscanf / fgets)", k: ["fscanf", "fgets", "fread"] },
      { l: "Empile les valeurs lues", k: ["empiler"] },
      { l: "Ferme le fichier (fclose)", k: ["fclose"], w: ["fopen"] },
    ],
    conseil: "Teste toujours `if (f == NULL)` juste après le fopen.",
    erreur: "Oublier fclose : on laisse un descripteur de fichier ouvert.",
    fiches: ["i-fich"],
  },
  "x-i4": {
    func: "diviserFile",
    criteres: [
      { l: "Parcourt la file source", k: ["defiler"], w: ["while"] },
      { l: "Teste la parité d'un élément (% 2)", k: ["% 2", "%2", "pair", "impair"] },
      { l: "Enfile dans la bonne file", k: ["enfiler"] },
      { l: "Gère le cas file vide", k: ["filevide", "!filevide"], w: ["while", "vide"] },
    ],
    conseil: "`x % 2 == 0` sépare les pairs des impairs.",
    erreur: "Vider la file source sans la reconstituer si l'énoncé demande de la garder.",
    fiches: ["i-pf"],
  },
  "x-i5": {
    func: "fusionnerFiles",
    criteres: [
      { l: "Défile les deux files", k: ["defiler"] },
      { l: "Enfile en alternant les deux files", k: ["enfiler"] },
      { l: "Gère des files de tailles différentes", k: ["filevide", "!filevide"], w: ["while", "vide"] },
      { l: "Ne perd aucun élément (parcours complet)", k: ["while"], w: ["for"] },
    ],
    conseil: "Quand une file est vide, vide entièrement l'autre avant de t'arrêter.",
    erreur: "S'arrêter dès qu'UNE file est vide : on perd la fin de l'autre file.",
    fiches: ["i-pf"],
  },
  "x-i6": {
    func: "sommeFile",
    criteres: [
      { l: "Parcourt la file", k: ["defiler"], w: ["while"] },
      { l: "Accumule la somme", k: ["+=", "somme", "total"] },
      { l: "Restaure la file (ne la vide pas)", k: ["enfiler"] },
      { l: "Gère le cas file vide", k: ["filevide", "!filevide"], w: ["while", "vide"] },
    ],
    conseil: "Ré-enfile chaque élément après l'avoir lu pour ne pas détruire la file.",
    erreur: "Renvoyer la bonne somme mais laisser la file vidée à la sortie.",
    fiches: ["i-pf"],
  },
  "x-i7": {
    func: "saisirReels",
    criteres: [
      { l: "Alloue la mémoire avec malloc", k: ["malloc"] },
      { l: "Vérifie le retour de malloc (NULL)", k: ["null"], w: ["malloc"] },
      { l: "Saisit les valeurs (scanf avec &)", k: ["scanf"] },
      { l: "Manipule correctement les pointeurs", k: ["->", "*", "&"] },
      { l: "Libère la mémoire avec free", k: ["free"], w: ["malloc"] },
    ],
    conseil: "Pour n réels : `malloc(n * sizeof(double))`, puis free à la fin.",
    erreur: "Oublier free, ou ne pas tester `malloc == NULL`.",
    fiches: ["i-alloc"],
  },
  "x-i8": {
    func: "gererGuichets",
    criteres: [
      { l: "Utilise la structure t_guichet", k: ["t_guichet", "guichet"] },
      { l: "Alloue la mémoire si nécessaire", k: ["malloc"] },
      { l: "Traite chaque guichet (boucle)", k: ["for", "while"] },
      { l: "Libère la mémoire (free)", k: ["free"], w: ["malloc"] },
    ],
    conseil: "Une boucle `for` sur le nombre de guichets, puis free à la fin.",
    erreur: "Allouer dans la boucle sans libérer ensuite : fuite mémoire.",
    fiches: ["i-struct", "i-alloc"],
  },
};

/* ================== DOCUMENTS DU ZIP ================== */

const DOCS = [
  { subject: "info", name: "Allegro — cours 1 à 4", type: "Cours", importance: "utile",
    path: "Revision/Informatique/Cours informatique/allegro_cours1..4_2024_2025.pdf",
    resume: "Bibliothèque graphique : BITMAP, affichage, clavier, souris, boucle de jeu.",
    detail: "Quatre PDF qui couvrent la librairie graphique Allegro 4 : initialisation et END_OF_MAIN, structure BITMAP, chargement et affichage d'images (blit, draw_sprite), gestion du clavier et de la souris, boucle de jeu et double buffering, détection de collisions. Tout est synthétisé dans la fiche « Allegro 4 » du site." },
  { subject: "info", name: "Allocation dynamique (chap. 16)", type: "Cours", importance: "essentiel",
    path: "Revision/Informatique/Cours informatique/chapitre16_allocation_dynamique.pdf",
    resume: "malloc/calloc/realloc/free, pile vs tas, chaînes dynamiques.",
    detail: "Le chapitre de référence sur la mémoire dynamique : différence pile / tas, opérateur sizeof, les quatre fonctions malloc, calloc, realloc et free, le schéma de la chaîne dynamique (fgets + malloc + strcpy) et les règles de libération. Repris dans les fiches « Allocation dynamique » et « Tableaux »." },
  { subject: "info", name: "Files & Piles", type: "Cours", importance: "essentiel",
    path: "Revision/Informatique/Cours informatique/files_piles.pdf",
    resume: "FIFO/LIFO, tableau circulaire, double ancrage.",
    detail: "Cours sur les deux conteneurs : principe FIFO de la file et LIFO de la pile, implémentation par tableau circulaire et par liste chaînée (double ancrage pour la file, ancre unique pour la pile), sous-programmes enfiler/défiler/empiler/dépiler. Base des fiches « Piles & Files » et « Tas »." },
  { subject: "info", name: "Listes chaînées", type: "Cours", importance: "essentiel",
    path: "Revision/Informatique/Cours informatique/Listes_chainees.pdf",
    resume: "Maillons, ancre, parcours, insertion, suppression.",
    detail: "Cours sur les listes chaînées : structure d'un maillon (donnée + pointeur suivant), l'ancre, parcours avec une copie de l'ancre, insertion en tête, suppression d'un maillon, libération complète. Synthétisé dans la fiche « Listes chaînées »." },
  { subject: "info", name: "Récursivité", type: "Cours", importance: "utile",
    path: "Revision/Informatique/Cours informatique/recursivite_4.pdf",
    resume: "Cas de base, cas récursif, pile d'appels, Hanoï.",
    detail: "Cours sur la récursivité : cas de base et cas récursif, fonctionnement de la pile d'appels, exemples classiques (factorielle, tours de Hanoï). Repris dans la fiche « Récursivité »." },
  { subject: "info", name: "Partiel ING1 S2 2024-2025 (Palasi)", type: "Partiel", importance: "essentiel",
    path: "Revision/Informatique/TD informatique/partiel_ING1_semestre2_2024-2025_palasi.pdf",
    resume: "Patients aux urgences : structures, files, file de priorité.",
    detail: "Le vrai partiel du semestre : questions de cours sur piles/files, compréhension d'un code de conversion infixe→postfixe, et un exercice complet de gestion des patients aux urgences (type t_patient, file d'attente FIFO, file de priorité par tas). Entièrement reconstitué et jouable dans l'onglet Entraînement.",
    annale: "a-info-1" },
  { subject: "info", name: "Correction partiel ING1 2025", type: "Correction", importance: "essentiel",
    path: "Revision/Informatique/TD informatique/correction_partiel_ing1_2025.pdf",
    resume: "Corrigé du partiel patients : initPatient, gererPatient, main.",
    detail: "Le corrigé officiel du partiel patients. Les corrections sont intégrées question par question dans l'annale « Patients aux urgences » du site.",
    annale: "a-info-1" },
  { subject: "info", name: "Proposition partiel rattrapage 2025", type: "Partiel", importance: "essentiel",
    path: "Revision/Informatique/TD informatique/proposition_partiel_rattrapage_ing1_2025_version_finale.pdf",
    resume: "Parking intelligent : t_voiture, file avec priorité.",
    detail: "Le sujet de rattrapage : gestion d'un parking intelligent avec le type t_voiture (plaque dynamique, heure, priorité), file gérée par liste chaînée avec recherche conditionnelle des voitures prioritaires. Jouable dans l'onglet Entraînement.",
    annale: "a-info-2" },
  { subject: "info", name: "Correction rattrapage 2025", type: "Correction", importance: "essentiel",
    path: "Revision/Informatique/TD informatique/correction_proposition_partiel_rattrapage_ing1_2025.pdf",
    resume: "Corrigé du parking : initVoiture, autoriserEntree, main.",
    detail: "Le corrigé du sujet de rattrapage parking, intégré question par question dans l'annale « Parking intelligent » du site.",
    annale: "a-info-2" },
  { subject: "info", name: "TP simulation files / guichets", type: "TP", importance: "utile",
    path: "Revision/Informatique/TD informatique/TP_simulation_files_guichets.pdf",
    resume: "Tableau dynamique de t_guichet, chacun avec sa file.",
    detail: "TP de simulation : un tableau dynamique de structures t_guichet, chaque guichet ayant un état et sa propre file d'attente imbriquée. Repris dans l'exercice « TP — Simulation des guichets » des Exercices info." },
  { subject: "info", name: "TP livraison de conteneurs", type: "TP", importance: "bonus",
    path: "Revision/Informatique/TD informatique/TP_livraison_conteneurs.pdf",
    resume: "Application des piles/files à un problème de logistique.",
    detail: "TP appliquant les piles et les files à un problème de logistique de conteneurs. Bon entraînement complémentaire aux exercices de structures de données." },
  { subject: "info", name: "Support exercices cours / TD", type: "TD", importance: "utile",
    path: "Revision/Informatique/TD informatique/support_exercice_cours_TD.pdf",
    resume: "Exercices d'entraînement sur les structures de données.",
    detail: "Recueil d'exercices de TD sur les pointeurs, structures, piles, files et listes. Les exercices types en sont tirés (copier une pile, inverser une file, fusionner, somme, etc.)." },

  { subject: "math", name: "Chapitre 9 — Développements limités", type: "Cours", importance: "essentiel",
    path: "Revision/Mathématique/Cours mathématique/Chapitre 9 - Développement Limité.pdf",
    resume: "Taylor-Young, DL usuels, limites et tangentes.",
    detail: "Le cours complet sur les développements limités : formule de Taylor-Young, DL usuels en 0, opérations sur les DL, application au calcul de limites et à l'étude de tangentes. Synthétisé dans la fiche « Développements limités »." },
  { subject: "math", name: "Chapitre 10 — Intégrales généralisées", type: "Cours", importance: "essentiel",
    path: "Revision/Mathématique/Cours mathématique/Chapitre 10 - intégrale généralisée.pdf",
    resume: "Convergence, Riemann, critères de comparaison.",
    detail: "Cours sur les intégrales généralisées : définition de la convergence, intégrales de Riemann de référence, critères de comparaison, d'équivalence et de négligeabilité, convergence absolue. Repris dans la fiche « Intégrales généralisées »." },
  { subject: "math", name: "Chapitre 11 — Matrices", type: "Cours", importance: "essentiel",
    path: "Revision/Mathématique/Cours mathématique/Chapitre 11 - Matrice.pdf",
    resume: "Opérations, produit, inverse, systèmes AX = B.",
    detail: "Cours sur les matrices : opérations, produit matriciel, matrice inverse, résolution de systèmes linéaires par la méthode de l'inverse et par Gauss. Synthétisé dans la fiche « Matrices »." },
  { subject: "math", name: "Chapitre 12 — Déterminants", type: "Cours", importance: "essentiel",
    path: "Revision/Mathématique/Cours mathématique/Chapitre 12 - déterminant.pdf",
    resume: "Calcul (Sarrus, cofacteurs), propriétés, inversibilité.",
    detail: "Cours sur les déterminants : calcul en 2×2 et 3×3 (règle de Sarrus), développement par cofacteurs, propriétés, lien avec l'inversibilité d'une matrice. Repris dans la fiche « Déterminants »." },
  { subject: "math", name: "Fiche DL", type: "Fiche", importance: "essentiel",
    path: "Revision/Mathématique/TD mathématique/Fiche DL.pdf",
    resume: "Synthèse : tous les DL usuels et la recette de calcul.",
    detail: "Fiche de synthèse très bien faite : tous les DL usuels en 0, la recette pour calculer un DL, le lien avec les équivalents et les limites. C'est elle qui a servi de base à la fiche « Développements limités » du site." },
  { subject: "math", name: "Fiche Intégrales généralisées", type: "Fiche", importance: "essentiel",
    path: "Revision/Mathématique/TD mathématique/Fiche Intégrales généralisées.pdf",
    resume: "Synthèse : définitions, Riemann, critères de convergence.",
    detail: "Fiche de synthèse sur les intégrales généralisées : définitions de la convergence, intégrales de Riemann, tous les critères. A servi de base à la fiche « Intégrales généralisées »." },
  { subject: "math", name: "Partiel Analyse 2 & Algèbre 2", type: "Partiel", importance: "essentiel",
    path: "Revision/Mathématique/TD mathématique/Partiel Analyse 2 et Algèbre 2.pdf",
    resume: "Système matriciel, inverse, Gauss, intégrales généralisées.",
    detail: "Le vrai partiel de maths : un système linéaire à résoudre par la méthode de l'inverse et par Gauss, et deux intégrales généralisées (calcul et nature). Reconstitué et jouable dans l'annale « Analyse 2 & Algèbre 2 ».",
    annale: "a-math-1" },
  { subject: "math", name: "Corrigé Partiel + Corrigé DS2", type: "Correction", importance: "essentiel",
    path: "Revision/Mathématique/TD mathématique/Corrigé Partiel Analyse 2 et Algèbre 2.pdf",
    resume: "Corrigés détaillés des partiels et du DS2 de maths.",
    detail: "Corrigés officiels du partiel et du DS2. Les corrections sont reprises dans l'annale de maths du site.",
    annale: "a-math-1" },
  { subject: "math", name: "Poly d'exercices ING1 2025-2026", type: "TD", importance: "utile",
    path: "Revision/Mathématique/TD mathématique/Poly_Exercices_ING1_2025-2026V2.pdf",
    resume: "Recueil d'exercices sur tout le programme.",
    detail: "Le polycopié d'exercices de l'année : entraînement progressif sur les DL, les intégrales, les matrices et les déterminants. Complète les exercices et sujets d'entraînement du site." },

  { subject: "meca", name: "Chapitre 1 — Travail & puissance", type: "Cours", importance: "essentiel",
    path: "Revision/Mécanique/Cours mécanique/ING1_2022_polycours_S2_2026_Chapitre1.pdf",
    resume: "Travail d'une force, puissance, théorème de l'énergie cinétique.",
    detail: "Cours sur le travail et la puissance d'une force, et le théorème de l'énergie cinétique (TEC). Synthétisé dans la fiche « Travail & puissance »." },
  { subject: "meca", name: "Chapitre 2 — Énergie potentielle", type: "Cours", importance: "essentiel",
    path: "Revision/Mécanique/Cours mécanique/ING1_2022_polycours_S2_2026_Chapitre2.pdf",
    resume: "Forces conservatives, Ep usuelles, équilibre.",
    detail: "Cours sur l'énergie potentielle : forces conservatives, énergies potentielles de pesanteur et de ressort, équilibre et stabilité (puits de potentiel). Repris dans la fiche « Énergie potentielle »." },
  { subject: "meca", name: "Chapitre 3 — Énergie mécanique", type: "Cours", importance: "essentiel",
    path: "Revision/Mécanique/Cours mécanique/ING1_2022_polycours_S2_2026_Chapitre3.pdf",
    resume: "TEM, conservation de l'énergie, mise en équation.",
    detail: "Cours sur l'énergie mécanique : théorème de l'énergie mécanique, conservation, mise en équation d'un oscillateur par méthode énergétique. Synthétisé dans la fiche « Énergie mécanique »." },
  { subject: "meca", name: "Chapitre 4 — Oscillations libres", type: "Cours", importance: "essentiel",
    path: "Revision/Mécanique/Cours mécanique/ING1_2022_polycours_S2_2026_Chapitre4.pdf",
    resume: "Oscillateur harmonique, pulsation propre, énergie.",
    detail: "Cours sur les oscillations libres : équation de l'oscillateur harmonique, pulsation propre, systèmes masse-ressort et pendule, ressorts équivalents, énergie. Repris dans la fiche « Oscillateur harmonique »." },
  { subject: "meca", name: "Chapitre 5 — Oscillations amorties", type: "Cours", importance: "utile",
    path: "Revision/Mécanique/Cours mécanique/ING1_polycours_S2_2026_Chapitre5.pdf",
    resume: "Amortissement, trois régimes, facteur de qualité.",
    detail: "Cours sur les oscillations amorties : équation du mouvement amorti, les trois régimes (pseudo-périodique, critique, apériodique), facteur de qualité, pseudo-période. Synthétisé dans la fiche « Oscillateur amorti »." },
  { subject: "meca", name: "Partiel ING1 2025 — Oscillations", type: "Partiel", importance: "essentiel",
    path: "Revision/Mécanique/TD mécanique/PARTIEL_ING1_2025_S2.pdf",
    resume: "TEC, ressorts en série, pendule amorti.",
    detail: "Le vrai partiel de mécanique : questions de cours (TEC, ressorts en série), exercice complet sur un pendule amorti (énergies, équation différentielle, temps caractéristique, régime pseudo-périodique). Jouable dans l'annale « Oscillations ».",
    annale: "a-meca-1" },
  { subject: "meca", name: "DS1 ING1 2026 — Oscillations", type: "Partiel", importance: "essentiel",
    path: "Revision/Mécanique/TD mécanique/DS1_ING1_2026_Oscillations.pdf",
    resume: "TPC, forces conservatives, piste avec frottements.",
    detail: "Le DS d'oscillations : théorème de la puissance cinétique, forces conservatives, parcours d'une piste avec une partie à frottements. Bon complément à l'annale de mécanique." },
  { subject: "meca", name: "Cahier de TD + corrigés (TD1 à TD5)", type: "Correction", importance: "utile",
    path: "Revision/Mécanique/TD mécanique/cahierTD_ING1_2025_S2.pdf (+ corrigés)",
    resume: "Tous les TD de mécanique avec corrigés détaillés.",
    detail: "Le cahier de TD et l'ensemble des corrigés (TD1 à TD5) : travail, énergie, oscillations. Entraînement complémentaire aux exercices du site." },

  { subject: "elec", name: "Cours d'électronique", type: "Cours", importance: "essentiel",
    path: "Revision/Electronique/cour elec.pdf",
    resume: "Lois des circuits, régime sinusoïdal, filtres, AOP (PDF scanné).",
    detail: "Le cours complet d'électronique. Important : ce PDF est entièrement scanné (images), son texte n'est pas extractible — les fiches d'électronique du site sont donc construites à partir du programme standard ING1. Vérifie qu'elles correspondent bien à ce document." },
  { subject: "elec", name: "TD d'électronique", type: "TD", importance: "essentiel",
    path: "Revision/Electronique/td elec.pdf",
    resume: "Exercices : circuits, diviseurs, filtres, AOP (PDF scanné).",
    detail: "Le TD d'électronique (circuits, diviseurs, impédances, filtres, montages AOP). Comme le cours, ce PDF est scanné : si tu me retapes le contenu d'un exercice, je peux le transformer en annale jouable." },
];

/* ================== SUJETS D'ENTRAÎNEMENT INÉDITS ================== */

const TRAINING = [
  /* ---------- INFORMATIQUE ---------- */
  {
    id: "t-info-1", subject: "info", level: "normal", duration: 60, bareme: 20,
    title: "Entraînement Info nº1 — Files, piles & allocation",
    tags: ["piles", "files", "structures", "allocation"],
    parts: [
      { title: "Partie 1 — Cours", items: [
        { n: "1.1", pts: "2 pts", q: [{ t: "p", v: "Donner le principe d'une pile et d'une file. Pour chacune, citer un domaine d'application." }],
          indice: "LIFO / FIFO. Pile : pile d'appels. File : files d'attente.",
          c: [{ t: "p", v: "Pile : LIFO (dernier entré, premier sorti) — ex. pile d'appels de fonctions. File : FIFO (premier entré, premier sorti) — ex. gestion des processus, files d'attente." }] },
        { n: "1.2", pts: "2 pts", q: [{ t: "p", v: "Que retourne malloc en cas d'échec ? Pourquoi une librairie de file utilise-t-elle un void* ?" }],
          indice: "NULL ; généricité.",
          c: [{ t: "p", v: "malloc retourne NULL en cas d'échec (à tester systématiquement). Le void* rend la librairie générique : elle gère des files de n'importe quel type, le maillon stockant juste une adresse." }] },
      ]},
      { title: "Partie 2 — Structures", items: [
        { n: "2.1", pts: "2 pts", q: [{ t: "p", v: "Définir un type t_produit : nom (chaîne dynamique), prix (réel), quantité (entier)." }],
          indice: "typedef struct, le nom est un char*.",
          c: [{ t: "code", v: `typedef struct {
    char *nom;
    float prix;
    int   quantite;
} t_produit;` }] },
        { n: "2.2", pts: "4 pts", q: [{ t: "p", v: "Écrire initProduit(t_produit *p) : saisie du nom (champ dynamique), du prix et de la quantité." }],
          indice: "fgets → strcspn → malloc(strlen+1) → strcpy pour le nom.",
          c: [{ t: "code", v: `void initProduit(t_produit *p) {
    char buf[100];
    printf("Nom : ");
    fgets(buf, sizeof(buf), stdin);
    buf[strcspn(buf, "\\n")] = '\\0';
    p->nom = malloc(strlen(buf) + 1);
    if (p->nom == NULL) exit(1);
    strcpy(p->nom, buf);
    printf("Prix : ");      scanf("%f", &p->prix);
    printf("Quantite : ");  scanf("%d", &p->quantite);
}` }] },
      ]},
      { title: "Partie 3 — File", items: [
        { n: "3.1", pts: "4 pts", q: [{ t: "p", v: "Écrire compterChers(t_file *f) qui retourne le nombre de produits de prix > 100, la file restant inchangée." }],
          indice: "Boucler tailleF fois : défiler, tester, réenfiler.",
          c: [{ t: "code", v: `int compterChers(t_file *f) {
    int nb = 0, taille = tailleF(f);
    for (int i = 0; i < taille; i++) {
        t_produit *p = (t_produit*) defiler(f);
        if (p->prix > 100) nb++;
        enfiler(f, p);
    }
    return nb;
}` }] },
        { n: "3.2", pts: "4 pts", q: [{ t: "p", v: "Compléter le main : remplir une file de 5 produits, compter les chers, tout libérer." },
          { t: "code", v: `int main() {
    t_file f;  ____ ;
    for (int i = 0; i < 5; i++) {
        t_produit *p = ____ ;
        initProduit(p);
        ____ ;
    }
    printf("%d chers\\n", compterChers(&f));
    while (!fileVide(&f)) {
        t_produit *p = ____ ;
        ____ ;  ____ ;
    }
    return 0;
}` }],
          indice: "init_file ; malloc(sizeof(t_produit)) ; enfiler ; defiler ; free(p->nom) puis free(p).",
          c: [{ t: "code", v: `int main() {
    t_file f;  init_file(&f);
    for (int i = 0; i < 5; i++) {
        t_produit *p = malloc(sizeof(t_produit));
        initProduit(p);
        enfiler(&f, p);
    }
    printf("%d chers\\n", compterChers(&f));
    while (!fileVide(&f)) {
        t_produit *p = (t_produit*) defiler(&f);
        free(p->nom);  free(p);
    }
    return 0;
}` }] },
      ]},
      { title: "Partie 4 — Bonus", items: [
        { n: "4.1", pts: "2 pts", q: [{ t: "p", v: "À quoi sert le double buffering en Allegro ?" }],
          indice: "Clignotements.",
          c: [{ t: "p", v: "On dessine tout sur une BITMAP intermédiaire puis on la copie d'un coup à l'écran : cela évite les clignotements dus au rafraîchissement pendant le dessin." }] },
      ]},
    ],
    conseils: ["Toujours tester le retour de malloc.", "Libérer le champ dynamique AVANT la structure.", "Pour parcourir une file sans la vider : defiler + enfiler en bouclant tailleF fois."],
    erreurs: ["Oublier le & dans scanf.", "free(p) avant free(p->nom).", "Boucle while(!fileVide) en réenfilant → boucle infinie."],
  },
  {
    id: "t-info-2", subject: "info", level: "difficile", duration: 90, bareme: 20,
    title: "Entraînement Info nº2 — Listes, récursivité & analyse de code",
    tags: ["listes", "récursivité", "fichiers", "analyse de code"],
    parts: [
      { title: "Partie 1 — Analyse de code", items: [
        { n: "1.1", pts: "3 pts", q: [{ t: "p", v: "Que retourne mystere(\"radar\") ? Que fait la fonction ?" },
          { t: "code", v: `int mystere(char *s, int i, int j) {
    if (i >= j) return 1;
    if (s[i] != s[j]) return 0;
    return mystere(s, i+1, j-1);
}` }],
          indice: "Compare les caractères symétriques. Appel : mystere(s, 0, strlen(s)-1).",
          c: [{ t: "p", v: "mystere(\"radar\", 0, 4) compare r/r, a/a, puis i≥j → retourne 1. La fonction teste récursivement si la chaîne est un PALINDROME (1 = oui, 0 = non)." }] },
        { n: "1.2", pts: "3 pts", q: [{ t: "p", v: "Cette fonction doit créer un tableau de n entiers à 0. Trouver les 3 erreurs." },
          { t: "code", v: `int* creer(int n) {
    int t[n];
    for (int i = 0; i <= n; i++) t[i] = 0;
    return t;
}` }],
          indice: "Tableau local, indice i<=n, retour d'adresse locale.",
          c: [{ t: "p", v: "Erreur 1 : t[n] est local (pile), détruit à la sortie. Erreur 2 : i <= n écrit dans t[n], hors tableau. Erreur 3 : return t retourne une adresse invalide. Correction : malloc(n*sizeof(int)), i < n, retourner le pointeur alloué." }] },
      ]},
      { title: "Partie 2 — Listes chaînées", items: [
        { n: "2.1", pts: "4 pts", q: [{ t: "p", v: "Écrire compter(t_maillon *tete) qui retourne le nombre de maillons d'une liste, de façon RÉCURSIVE." }],
          indice: "Cas de base : liste vide → 0. Sinon : 1 + compter(suivant).",
          c: [{ t: "code", v: `int compter(t_maillon *tete) {
    if (tete == NULL) return 0;          // cas de base
    return 1 + compter(tete->suivant);   // cas recursif
}` }] },
        { n: "2.2", pts: "4 pts", q: [{ t: "p", v: "Écrire libererListe(t_maillon *tete) qui libère tous les maillons (version itérative)." }],
          indice: "Sauvegarder le suivant AVANT le free.",
          c: [{ t: "code", v: `void libererListe(t_maillon *tete) {
    t_maillon *c = tete;
    while (c != NULL) {
        t_maillon *suiv = c->suivant;
        free(c);
        c = suiv;
    }
}` }] },
      ]},
      { title: "Partie 3 — Fichiers", items: [
        { n: "3.1", pts: "3 pts", q: [{ t: "p", v: "Écrire sauverEntiers(const char *nom, int *tab, int n) : sauvegarde n entiers dans un fichier texte, n en première ligne." }],
          indice: "fopen \"w\", tester NULL, fprintf, fclose.",
          c: [{ t: "code", v: `void sauverEntiers(const char *nom, int *tab, int n) {
    FILE *f = fopen(nom, "w");
    if (f == NULL) return;
    fprintf(f, "%d\\n", n);
    for (int i = 0; i < n; i++)
        fprintf(f, "%d\\n", tab[i]);
    fclose(f);
}` }] },
      ]},
      { title: "Partie 4 — Cours", items: [
        { n: "4.1", pts: "0 pt" === "0 pt" ? "0,5 pt" : "0,5 pt", q: [{ t: "p", v: "Pourquoi une récursivité sans cas de base est-elle dangereuse ?" }],
          indice: "La pile d'appels.",
          c: [{ t: "p", v: "Les frames d'appel s'empilent indéfiniment : la pile d'appels déborde (stack overflow) et le programme plante." }] },
      ]},
    ],
    conseils: ["Pour une fonction récursive : toujours écrire le cas de base en premier.", "En libérant une liste, sauvegarder le suivant avant le free.", "Pour analyser un code, dérouler à la main avec un petit exemple."],
    erreurs: ["Indice i <= n au lieu de i < n.", "Retourner l'adresse d'un tableau local.", "Oublier de tester fopen."],
  },

  /* ---------- MATHÉMATIQUES ---------- */
  {
    id: "t-math-1", subject: "math", level: "normal", duration: 60, bareme: 20,
    title: "Entraînement Maths nº1 — DL & intégrales",
    tags: ["DL", "intégrales", "limites"],
    parts: [
      { title: "Exercice 1 — Développements limités", items: [
        { n: "1.1", pts: "3 pts", q: [{ t: "p", v: "Donner le développement limité à l'ordre 4 en 0 de $\\cos(x)$." }],
          indice: "cos n'a que des termes pairs.",
          c: [{ t: "p", v: "Le développement limité de $\\cos$ ne contient que des termes pairs :" }, { t: "formula", tex: ["\\cos(x) = 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} + o(x^4)", "\\cos(x) = 1 - \\frac{x^2}{2} + \\frac{x^4}{24} + o(x^4)"] }] },
        { n: "1.2", pts: "4 pts", q: [{ t: "p", v: "Calculer le développement limité à l'ordre 3 en 0 de $f(x) = \\ln(1+x)\\, e^x$." }],
          indice: "DL à l'ordre 3 de chaque facteur, puis produit tronqué.",
          c: [{ t: "p", v: "On écrit le DL à l'ordre 3 de chaque facteur :" }, { t: "formula", tex: ["\\ln(1+x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} + o(x^3)", "e^x = 1 + x + \\frac{x^2}{2} + o(x^3)"] }, { t: "p", v: "On effectue le produit en ne gardant que les termes jusqu'à $x^3$ :" }, { t: "formula", tex: "f(x) = x + \\frac{x^2}{2} + \\frac{x^3}{3} + o(x^3)" }] },
      ]},
      { title: "Exercice 2 — Limite", items: [
        { n: "2.1", pts: "4 pts", q: [{ t: "p", v: "Calculer la limite suivante :" }, { t: "formula", tex: "\\lim_{x \\to 0} \\frac{\\sin x - x}{x^3}" }],
          indice: "DL de sin(x) à l'ordre 3.",
          c: [{ t: "p", v: "On utilise le DL de $\\sin$ à l'ordre 3 :" }, { t: "formula", tex: ["\\sin(x) = x - \\frac{x^3}{6} + o(x^3)", "\\sin(x) - x = -\\frac{x^3}{6} + o(x^3)", "\\frac{\\sin x - x}{x^3} = -\\frac{1}{6} + o(1)"] }, { t: "p", v: "La limite vaut donc :" }, { t: "formula", tex: "\\lim_{x \\to 0} \\frac{\\sin x - x}{x^3} = -\\frac{1}{6}" }] },
      ]},
      { title: "Exercice 3 — Intégrales généralisées", items: [
        { n: "3.1", pts: "4 pts", q: [{ t: "p", v: "Étudier la nature de l'intégrale suivante :" }, { t: "formula", tex: "\\int_1^{+\\infty} \\frac{dx}{x^3 + 1}" }],
          indice: "Équivalent en +∞ puis comparaison à Riemann.",
          c: [{ t: "p", v: "En $+\\infty$, on cherche un équivalent simple :" }, { t: "formula", tex: "\\frac{1}{x^3 + 1} \\sim \\frac{1}{x^3}" }, { t: "p", v: "L'intégrale de référence est une intégrale de Riemann en $+\\infty$ avec $\\alpha = 3 > 1$ : elle converge. Par équivalence de fonctions positives, l'intégrale étudiée converge." }] },
        { n: "3.2", pts: "5 pts", q: [{ t: "p", v: "Calculer l'intégrale suivante (en justifiant la convergence) :" }, { t: "formula", tex: "\\int_0^{+\\infty} e^{-x}\\, dx" }],
          indice: "Primitive de e^(−x), puis limite.",
          c: [{ t: "p", v: "On calcule l'intégrale sur $[0, X]$, puis on fait tendre $X$ vers $+\\infty$ :" }, { t: "formula", tex: ["\\int_0^X e^{-x}\\, dx = \\left[ -e^{-x} \\right]_0^X = 1 - e^{-X}", "\\lim_{X \\to +\\infty} \\left( 1 - e^{-X} \\right) = 1"] }, { t: "p", v: "La limite est finie : l'intégrale converge et vaut 1." }] },
      ]},
    ],
    conseils: ["Apprendre les DL usuels par cœur : c'est non négociable.", "Pour une intégrale : équivalent en la borne + comparaison à Riemann.", "Vérifier l'ordre demandé et garder le o(xⁿ)."],
    erreurs: ["Confondre les débuts de DL (sin, cos, ln).", "Oublier de justifier la convergence avant de calculer.", "Se tromper sur le sens de Riemann (α>1 à l'infini, β<1 en 0)."],
  },
  {
    id: "t-math-2", subject: "math", level: "difficile", duration: 90, bareme: 20,
    title: "Entraînement Maths nº2 — Matrices, déterminants & analyse",
    tags: ["matrices", "déterminants", "systèmes", "intégrales"],
    parts: [
      { title: "Exercice 1 — Système linéaire", items: [
        { n: "1.1", pts: "2 pts", q: [{ t: "p", v: "Écrire sous forme matricielle $AX = B$ le système suivant :" }, { t: "formula", tex: "\\begin{cases} 2x + y = 3 \\\\ x - y = 0 \\end{cases}" }],
          indice: "A contient les coefficients.",
          c: [{ t: "p", v: "On range les coefficients, les inconnues et les seconds membres :" }, { t: "formula", tex: "A = \\begin{pmatrix} 2 & 1 \\\\ 1 & -1 \\end{pmatrix} \\qquad X = \\begin{pmatrix} x \\\\ y \\end{pmatrix} \\qquad B = \\begin{pmatrix} 3 \\\\ 0 \\end{pmatrix}" }] },
        { n: "1.2", pts: "4 pts", q: [{ t: "p", v: "Montrer que $A$ est inversible, puis résoudre le système par la méthode de l'inverse." }],
          indice: "det(A) = ad − bc ; inverse 2×2.",
          c: [{ t: "p", v: "On calcule le déterminant :" }, { t: "formula", tex: "\\det(A) = 2 \\times (-1) - 1 \\times 1 = -3 \\neq 0" }, { t: "p", v: "Le déterminant est non nul, donc $A$ est inversible. On applique la formule de l'inverse d'une matrice $2 \\times 2$ :" }, { t: "formula", tex: "A^{-1} = \\frac{1}{-3} \\begin{pmatrix} -1 & -1 \\\\ -1 & 2 \\end{pmatrix} = \\frac{1}{3} \\begin{pmatrix} 1 & 1 \\\\ 1 & -2 \\end{pmatrix}" }, { t: "p", v: "On en déduit la solution :" }, { t: "formula", tex: "X = A^{-1} B = \\frac{1}{3} \\begin{pmatrix} 1 & 1 \\\\ 1 & -2 \\end{pmatrix} \\begin{pmatrix} 3 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}" }, { t: "p", v: "On obtient $x = 1$ et $y = 1$." }] },
      ]},
      { title: "Exercice 2 — Déterminant", items: [
        { n: "2.1", pts: "4 pts", q: [{ t: "p", v: "Calculer le déterminant de la matrice suivante :" }, { t: "formula", tex: "\\begin{vmatrix} 1 & 2 & 3 \\\\ 0 & 1 & 4 \\\\ 0 & 0 & 2 \\end{vmatrix}" }],
          indice: "Matrice triangulaire.",
          c: [{ t: "p", v: "La matrice est triangulaire supérieure : son déterminant est le produit des termes diagonaux." }, { t: "formula", tex: "\\det = 1 \\times 1 \\times 2 = 2" }] },
        { n: "2.2", pts: "3 pts", q: [{ t: "p", v: "Pour quelle(s) valeur(s) de $m$ la matrice suivante n'est-elle pas inversible ?" }, { t: "formula", tex: "\\begin{pmatrix} m & 1 \\\\ 2 & m \\end{pmatrix}" }],
          indice: "Non inversible ⟺ det = 0.",
          c: [{ t: "p", v: "La matrice n'est pas inversible lorsque son déterminant s'annule :" }, { t: "formula", tex: ["\\det = m \\times m - 1 \\times 2 = m^2 - 2", "\\det = 0 \\iff m^2 = 2 \\iff m = \\pm\\sqrt{2}"] }, { t: "p", v: "La matrice n'est pas inversible pour $m = \\sqrt{2}$ ou $m = -\\sqrt{2}$." }] },
      ]},
      { title: "Exercice 3 — Intégrale", items: [
        { n: "3.1", pts: "4 pts", q: [{ t: "p", v: "Étudier la nature de l'intégrale suivante :" }, { t: "formula", tex: "\\int_0^1 \\frac{dx}{\\sqrt{x}}" }],
          indice: "Riemann en 0 : β.",
          c: [{ t: "p", v: "On reconnaît une intégrale de Riemann en 0 :" }, { t: "formula", tex: "\\frac{1}{\\sqrt{x}} = \\frac{1}{x^{1/2}} \\qquad \\beta = \\frac{1}{2}" }, { t: "p", v: "Comme $\\beta = \\frac{1}{2} < 1$, l'intégrale converge." }, { t: "formula", tex: "\\int_0^1 \\frac{dx}{\\sqrt{x}} = \\left[ 2\\sqrt{x} \\right]_0^1 = 2" }] },
        { n: "3.2", pts: "3 pts", q: [{ t: "p", v: "Étudier la nature de l'intégrale suivante :" }, { t: "formula", tex: "\\int_1^{+\\infty} \\frac{dx}{\\sqrt{x}}" }],
          indice: "Riemann à l'infini : α.",
          c: [{ t: "p", v: "Cette fois, c'est une intégrale de Riemann en $+\\infty$ :" }, { t: "formula", tex: "\\frac{1}{\\sqrt{x}} = \\frac{1}{x^{1/2}} \\qquad \\alpha = \\frac{1}{2}" }, { t: "p", v: "Comme $\\alpha = \\frac{1}{2} < 1$, l'intégrale diverge." }, { t: "note", kind: "warn", v: "Même fonction qu'en 3.1, mais l'intervalle change : le critère de Riemann dépend de la borne problématique (β en 0, α à l'infini)." }] },
      ]},
    ],
    conseils: ["Pour un déterminant : repérer triangulaire / lignes nulles / proportionnelles avant de calculer.", "Inversibilité ⟺ déterminant non nul.", "Bien identifier QUELLE borne pose problème pour appliquer le bon critère."],
    erreurs: ["Inverser le critère de Riemann selon la borne.", "Erreur de signe dans les cofacteurs.", "Oublier de vérifier det ≠ 0 avant d'inverser."],
  },

  /* ---------- MÉCANIQUE ---------- */
  {
    id: "t-meca-1", subject: "meca", level: "normal", duration: 60, bareme: 20,
    title: "Entraînement Méca nº1 — Travail, énergie & TEC",
    tags: ["travail", "énergie", "TEC"],
    parts: [
      { title: "Exercice 1 — Cours", items: [
        { n: "1.1", pts: "2 pts", q: [{ t: "p", v: "Énoncer le théorème de l'énergie cinétique. Donner l'expression de l'énergie cinétique $E_c$." }],
          indice: "ΔEc = somme des travaux.",
          c: [{ t: "p", v: "Théorème de l'énergie cinétique : la variation d'énergie cinétique d'un point entre deux instants est égale à la somme des travaux des forces extérieures." }, { t: "formula", tex: ["\\Delta E_c = \\sum W_{\\text{ext}}", "E_c = \\frac{1}{2} m v^2"] }] },
        { n: "1.2", pts: "2 pts", q: [{ t: "p", v: "Qu'est-ce qu'une force conservative ? Le poids l'est-il ? Et les frottements ?" }],
          indice: "Travail indépendant du chemin.",
          c: [{ t: "p", v: "Une force est conservative si son travail ne dépend que des points de départ et d'arrivée. Le poids est conservatif ; les frottements ne le sont pas (le travail dépend du trajet)." }] },
      ]},
      { title: "Exercice 2 — Chute sur un plan incliné", items: [
        { n: "2.1", pts: "5 pts", q: [{ t: "p", v: "Un solide de masse $m$ part du repos en haut d'un plan incliné lisse, de dénivelé $h$. Déterminer sa vitesse en bas par le théorème de l'énergie cinétique." }],
          indice: "Seul le poids travaille ; W(poids) = mgh.",
          c: [{ t: "p", v: "Seul le poids travaille. On applique le TEC entre le haut ($v = 0$) et le bas ($v$) :" }, { t: "formula", tex: ["\\frac{1}{2} m v^2 - 0 = W_{\\text{poids}} = mgh", "v = \\sqrt{2gh}"] }] },
        { n: "2.2", pts: "4 pts", q: [{ t: "p", v: "On ajoute des frottements solides, de force $f$ constante, sur une longueur $L$. Donner la nouvelle vitesse en bas." }],
          indice: "Le travail des frottements est −f·L (résistant).",
          c: [{ t: "p", v: "Le travail des frottements est résistant : $W_{\\text{frott}} = -fL$. Le TEC donne :" }, { t: "formula", tex: ["\\frac{1}{2} m v^2 = W_{\\text{poids}} + W_{\\text{frott}} = mgh - fL", "v = \\sqrt{\\frac{2(mgh - fL)}{m}}"] }] },
      ]},
      { title: "Exercice 3 — Conservation de l'énergie", items: [
        { n: "3.1", pts: "5 pts", q: [{ t: "p", v: "Une bille est lâchée d'une hauteur $h$ sur un rail sans frottement. Par conservation de l'énergie mécanique, donner sa vitesse au point bas." }],
          indice: "Em conservée : Em(haut) = Em(bas).",
          c: [{ t: "p", v: "Le système est conservatif : l'énergie mécanique $E_m$ se conserve." }, { t: "formula", tex: ["E_m^{\\text{haut}} = mgh \\qquad E_m^{\\text{bas}} = \\frac{1}{2} m v^2", "mgh = \\frac{1}{2} m v^2 \\;\\Rightarrow\\; v = \\sqrt{2gh}"] }] },
        { n: "3.2", pts: "2 pts", q: [{ t: "p", v: "Pourquoi obtient-on le même résultat qu'en 2.1 ?" }],
          indice: "Sans frottement, les deux méthodes sont équivalentes.",
          c: [{ t: "p", v: "Sans frottement, le travail du poids correspond exactement à la variation d'énergie potentielle : le TEC et la conservation de $E_m$ donnent le même résultat. Ce sont deux façons d'écrire la même physique." }] },
      ]},
    ],
    conseils: ["Toujours vérifier l'homogénéité du résultat final.", "Bien identifier les forces qui travaillent (le poids oui, la réaction normale non).", "Mettre des flèches sur les vecteurs."],
    erreurs: ["Oublier le signe négatif du travail des frottements.", "Compter deux fois le poids (dans W et dans Ep).", "Confondre Ec et Ep."],
  },
  {
    id: "t-meca-2", subject: "meca", level: "difficile", duration: 90, bareme: 20,
    title: "Entraînement Méca nº2 — Oscillateurs amortis",
    tags: ["oscillateur", "amortissement", "équation différentielle"],
    parts: [
      { title: "Exercice 1 — Mise en équation", items: [
        { n: "1.1", pts: "5 pts", q: [{ t: "p", v: "Une masse $m$ sur un ressort de raideur $k$ subit un frottement fluide $\\vec{f} = -\\lambda \\vec{v}$. Établir l'équation du mouvement à partir des forces." }],
          indice: "Principe fondamental de la dynamique : m·a = Σ F.",
          c: [{ t: "p", v: "PFD projeté sur l'axe du mouvement :" }, { t: "formula", tex: ["m\\ddot{x} = -kx - \\lambda\\dot{x}", "m\\ddot{x} + \\lambda\\dot{x} + kx = 0", "\\ddot{x} + \\frac{\\lambda}{m}\\dot{x} + \\frac{k}{m}x = 0"] }, { t: "p", v: "Sous forme canonique :" }, { t: "formula", tex: "\\ddot{x} + \\frac{\\omega_0}{Q}\\dot{x} + \\omega_0^2\\, x = 0 \\qquad \\omega_0 = \\sqrt{\\frac{k}{m}}" }] },
        { n: "1.2", pts: "3 pts", q: [{ t: "p", v: "Retrouver cette équation par une méthode énergétique." }],
          indice: "dEm/dt = puissance des frottements.",
          c: [{ t: "p", v: "On dérive l'énergie mécanique : sa variation est égale à la puissance des frottements." }, { t: "formula", tex: ["E_m = \\frac{1}{2} m \\dot{x}^2 + \\frac{1}{2} k x^2", "\\frac{d E_m}{dt} = -\\lambda \\dot{x}^2", "m\\dot{x}\\ddot{x} + kx\\dot{x} = -\\lambda\\dot{x}^2", "m\\ddot{x} + \\lambda\\dot{x} + kx = 0"] }] },
      ]},
      { title: "Exercice 2 — Régimes", items: [
        { n: "2.1", pts: "4 pts", q: [{ t: "p", v: "Citer les trois régimes possibles et leur condition sur le facteur de qualité $Q$. Lequel revient le plus vite à l'équilibre ?" }],
          indice: "Q vs 1/2.",
          c: [{ t: "p", v: "Pseudo-périodique ($Q > \\frac{1}{2}$) : le système oscille en s'atténuant. Critique ($Q = \\frac{1}{2}$) : retour le plus rapide à l'équilibre, sans osciller. Apériodique ($Q < \\frac{1}{2}$) : retour lent, sans osciller. Le régime critique est le plus rapide." }] },
        { n: "2.2", pts: "4 pts", q: [{ t: "p", v: "On observe une courbe $\\theta(t)$ qui oscille en diminuant. Donner la forme de $\\theta(t)$ et nommer la pseudo-période." }],
          indice: "Enveloppe exponentielle × cosinus.",
          c: [{ t: "p", v: "C'est le régime pseudo-périodique :" }, { t: "formula", tex: "\\theta(t) = A\\, e^{-t/\\tau} \\cos(\\omega t + \\varphi)" }, { t: "p", v: "où $\\omega$ est la pseudo-pulsation (avec $\\omega < \\omega_0$), $T = \\frac{2\\pi}{\\omega}$ la pseudo-période, et $e^{-t/\\tau}$ l'enveloppe décroissante." }] },
      ]},
      { title: "Exercice 3 — Énergie", items: [
        { n: "3.1", pts: "4 pts", q: [{ t: "p", v: "L'énergie mécanique d'un oscillateur amorti est-elle conservée ? Justifier." }],
          indice: "TEM : ΔEm = W(forces non conservatives).",
          c: [{ t: "p", v: "Non. Le frottement fluide est une force non conservative, donc $\\Delta E_m = W_{\\text{frott}} < 0$. L'énergie mécanique décroît : elle est dissipée sous forme de chaleur. C'est ce qui amortit les oscillations." }] },
      ]},
    ],
    conseils: ["Maîtriser les deux méthodes de mise en équation (forces et énergie).", "La forme canonique fait apparaître ω₀ et Q directement.", "Reconnaître le régime à l'allure de la courbe."],
    erreurs: ["Erreur de signe sur la force de frottement.", "Oublier que ω < ω₀ en pseudo-périodique.", "Croire que Em est conservée avec amortissement."],
  },

  /* ---------- ÉLECTRONIQUE ---------- */
  {
    id: "t-elec-1", subject: "elec", level: "normal", duration: 60, bareme: 20,
    title: "Entraînement Élec nº1 — Lois des circuits & diviseurs",
    tags: ["lois", "diviseur", "résistances"],
    parts: [
      { title: "Exercice 1 — Cours", items: [
        { n: "1.1", pts: "2 pts", q: [{ t: "p", v: "Énoncer la loi des nœuds et la loi des mailles." }],
          indice: "Charges / tensions.",
          c: [{ t: "p", v: "Loi des nœuds : la somme des courants entrant dans un nœud égale la somme des courants sortants. Loi des mailles : la somme algébrique des tensions le long d'une maille fermée est nulle." }] },
        { n: "1.2", pts: "3 pts", q: [{ t: "p", v: "Calculer la résistance équivalente de $R_1 = 100\\,\\Omega$ et $R_2 = 100\\,\\Omega$ en série, puis en parallèle." }],
          indice: "Série : addition. Parallèle : produit/somme.",
          c: [{ t: "p", v: "En série les résistances s'additionnent ; en parallèle on applique la formule produit sur somme :" }, { t: "formula", tex: ["\\text{Série :}\\quad R = R_1 + R_2 = 200\\,\\Omega", "\\text{Parallèle :}\\quad R = \\frac{R_1 R_2}{R_1 + R_2} = \\frac{10000}{200} = 50\\,\\Omega"] }] },
      ]},
      { title: "Exercice 2 — Pont diviseur", items: [
        { n: "2.1", pts: "4 pts", q: [{ t: "p", v: "$R_1 = 2\\,\\text{k}\\Omega$ et $R_2 = 6\\,\\text{k}\\Omega$ sont en série sous une tension $U = 16\\,\\text{V}$. Calculer la tension aux bornes de $R_2$ (sortie à vide)." }],
          indice: "Formule du diviseur de tension.",
          c: [{ t: "p", v: "On applique la formule du diviseur de tension :" }, { t: "formula", tex: ["U_2 = U \\cdot \\frac{R_2}{R_1 + R_2}", "U_2 = 16 \\cdot \\frac{6}{2 + 6} = 16 \\cdot \\frac{6}{8} = 12\\,\\text{V}"] }] },
        { n: "2.2", pts: "3 pts", q: [{ t: "p", v: "À quelle condition la formule du diviseur reste-t-elle valable ?" }],
          indice: "Courant au point milieu.",
          c: [{ t: "p", v: "La formule n'est valable que si aucun courant n'est tiré au point milieu : la sortie doit être « à vide », ou la charge branchée doit avoir une résistance très grande devant R₂." }] },
      ]},
      { title: "Exercice 3 — Circuit", items: [
        { n: "3.1", pts: "5 pts", q: [{ t: "p", v: "Un générateur de tension $U = 12\\,\\text{V}$ alimente $R_1 = 4\\,\\Omega$ et $R_2 = 8\\,\\Omega$ en série. Calculer le courant $I$ du circuit et la puissance dissipée par $R_2$." }],
          indice: "I = U/R_eq, puis P = R·I².",
          c: [{ t: "p", v: "On calcule la résistance équivalente, le courant, puis la puissance :" }, { t: "formula", tex: ["R_{eq} = R_1 + R_2 = 12\\,\\Omega", "I = \\frac{U}{R_{eq}} = \\frac{12}{12} = 1\\,\\text{A}", "P_{R_2} = R_2 \\cdot I^2 = 8 \\times 1^2 = 8\\,\\text{W}"] }] },
        { n: "3.2", pts: "3 pts", q: [{ t: "p", v: "Vérifier le résultat avec la loi des mailles." }],
          indice: "U = R₁I + R₂I.",
          c: [{ t: "p", v: "La loi des mailles donne :" }, { t: "formula", tex: ["U = U_1 + U_2 = R_1 I + R_2 I", "12 = 4 \\cdot 1 + 8 \\cdot 1 = 12\\,\\text{V}"] }, { t: "p", v: "Le résultat est cohérent." }] },
      ]},
    ],
    conseils: ["Toujours préciser les unités et l'orientation des courants.", "Le diviseur de tension fait gagner beaucoup de temps.", "Vérifier avec la loi des mailles."],
    erreurs: ["Inverser série et parallèle.", "Appliquer le diviseur avec une charge non négligeable.", "Confondre P = RI² et P = UI."],
  },
  {
    id: "t-elec-2", subject: "elec", level: "difficile", duration: 90, bareme: 20,
    title: "Entraînement Élec nº2 — Filtres & amplificateur opérationnel",
    tags: ["filtres", "AOP", "régime sinusoïdal"],
    parts: [
      { title: "Exercice 1 — Filtre RC", items: [
        { n: "1.1", pts: "3 pts", q: [{ t: "p", v: "Donner la fonction de transfert d'un filtre RC passe-bas et sa pulsation de coupure." }],
          indice: "Diviseur de tension avec Z_C.",
          c: [{ t: "p", v: "Avec un diviseur de tension en complexe :" }, { t: "formula", tex: "H(j\\omega) = \\frac{Z_C}{R + Z_C} = \\frac{1}{1 + jRC\\omega}" }, { t: "p", v: "Pulsation de coupure :" }, { t: "formula", tex: "\\omega_c = \\frac{1}{RC}" }] },
        { n: "1.2", pts: "4 pts", q: [{ t: "p", v: "Pour $R = 1\\,\\text{k}\\Omega$ et $C = 1\\,\\mu\\text{F}$, calculer $\\omega_c$ et $f_c$. Que vaut le gain en dB à la coupure ?" }],
          indice: "ω_c = 1/(RC) ; G_dB = 20log|H|.",
          c: [{ t: "p", v: "On calcule la pulsation puis la fréquence de coupure :" }, { t: "formula", tex: ["\\omega_c = \\frac{1}{RC} = \\frac{1}{10^3 \\times 10^{-6}} = 1000\\,\\text{rad/s}", "f_c = \\frac{\\omega_c}{2\\pi} \\approx 159\\,\\text{Hz}"] }, { t: "p", v: "À la pulsation de coupure :" }, { t: "formula", tex: "|H| = \\frac{1}{\\sqrt{2}} \\;\\Rightarrow\\; G_{dB} = 20 \\log \\frac{1}{\\sqrt{2}} \\approx -3\\,\\text{dB}" }] },
      ]},
      { title: "Exercice 2 — Lecture de Bode", items: [
        { n: "2.1", pts: "4 pts", q: [{ t: "p", v: "Un diagramme de Bode montre un gain constant à 0 dB, puis une chute à −20 dB/décade après 2 kHz. Identifier le filtre et son ordre." }],
          indice: "Plat puis chute = ?",
          c: [{ t: "p", v: "Gain plat (0 dB) en basses fréquences puis chute : c'est un filtre passe-bas. La pente de −20 dB/décade indique un filtre d'ordre 1. La fréquence de coupure est 2 kHz." }] },
      ]},
      { title: "Exercice 3 — AOP", items: [
        { n: "3.1", pts: "3 pts", q: [{ t: "p", v: "Rappeler les hypothèses de l'AOP idéal en régime linéaire." }],
          indice: "Courants d'entrée + tensions d'entrée.",
          c: [{ t: "p", v: "AOP idéal : les courants d'entrée sont nuls ($i^+ = i^- = 0$) ; en régime linéaire (contre-réaction sur l'entrée −), les tensions d'entrée sont égales : $V^+ = V^-$." }] },
        { n: "3.2", pts: "6 pts", q: [{ t: "p", v: "Montage non inverseur : $V_e$ est appliquée sur l'entrée +, un pont $R_1$ (vers la masse) et $R_2$ (vers $V_s$) est branché sur l'entrée −. Établir $V_s$ en fonction de $V_e$, $R_1$ et $R_2$." }],
          indice: "V⁻ = diviseur de tension de Vs ; V⁺ = Ve ; V⁺ = V⁻.",
          c: [{ t: "p", v: "Comme $i^- = 0$, les résistances $R_1$ et $R_2$ forment un diviseur de tension :" }, { t: "formula", tex: "V^- = V_s \\cdot \\frac{R_1}{R_1 + R_2}" }, { t: "p", v: "En régime linéaire $V^+ = V^-$, et $V^+ = V_e$, d'où :" }, { t: "formula", tex: ["V_e = V_s \\cdot \\frac{R_1}{R_1 + R_2}", "V_s = V_e \\cdot \\frac{R_1 + R_2}{R_1} = \\left( 1 + \\frac{R_2}{R_1} \\right) V_e"] }] },
      ]},
    ],
    conseils: ["Le filtre passe-bas se retrouve avec un simple diviseur de tension en complexe.", "Vérifier la contre-réaction sur l'entrée − avant d'écrire V⁺ = V⁻.", "i⁺ = i⁻ = 0 permet d'appliquer le diviseur de tension autour de l'AOP."],
    erreurs: ["Oublier le facteur 2π entre ω et f.", "Écrire V⁺ = V⁻ sans contre-réaction (AOP saturé).", "Confondre passe-bas et passe-haut sur un Bode."],
  },
];

function trainingOf(subjectId) {
  return TRAINING.filter((t) => t.subject === subjectId);
}

/* ================== ANNALES — VRAIS PARTIELS DU ZIP ================== */

const ANNALES = [
  {
    id: "a-info-1", subject: "info", level: "reel", duration: 90, bareme: 20,
    title: "Partiel ING1 S2 2024-2025 — Patients aux urgences",
    tags: ["structures", "files", "file de priorité", "allocation"],
    revision: {
      evalue: "La maîtrise des structures de données : définir un type avec champ dynamique, manipuler une file FIFO et une file de priorité (tas), et compléter un main complet avec libération mémoire.",
      tombe: "La saisie d'une structure à champ dynamique, le défilage avec cast d'un void*, et la complétion d'un main (init → remplir → traiter → libérer) tombent presque à chaque session.",
      comment: "Relire d'abord les fiches Structures, Piles & Files et Tas, refaire la saisie d'une chaîne dynamique de mémoire, puis faire le sujet en mode examen sans regarder la correction.",
      fiches: ["i-struct", "i-pf", "i-tas", "i-alloc"],
      exos: ["x-i1", "x-i2", "x-i7", "x-i8"],
    },
    parts: [
      { title: "Exercice 1 — Questions de cours", items: [
        { n: "1.1", pts: "1 pt", q: [{ t: "p", v: "Indiquer le principe de la Pile et de la File (FIFO, LIFO)." }],
          indice: "Last in / First in.",
          c: [{ t: "p", v: "Pile : LIFO — dernier entré, premier sorti. File : FIFO — premier entré, premier sorti." }] },
        { n: "1.2", pts: "1,5 pt", q: [{ t: "p", v: "File d'entiers, tableau circulaire de taille 5. Enfiler 12, 7, 23 ; défiler 2 fois ; enfiler 14, 8, 35. Donner l'état final et le prochain élément défilé." }],
          indice: "Après 2 défilements il reste 23. La file « tourne » : 14, 8, 35 reviennent au début.",
          c: [{ t: "p", v: "Après les 2 défilements il reste 23 ; on enfile 14, 8, 35. Le tableau (indices 0→4) contient : 35, _, 23, 14, 8. Tête = 2, fin = 1. Prochain défilé : 23." }] },
        { n: "1.3", pts: "1 pt", q: [{ t: "p", v: "File par liste chaînée à deux ancres : où enfile-t-on, où défile-t-on ?" }],
          indice: "Une ancre par extrémité.",
          c: [{ t: "list", v: ["Enfilage : en FIN de liste.", "Défilage : en DÉBUT de liste."] }] },
        { n: "1.4", pts: "1 pt", q: [{ t: "p", v: "Pile à une ancre. Empiler X, H, P puis dépiler une fois. État de la pile ?" }],
          indice: "LIFO : on retire le dernier entré.",
          c: [{ t: "p", v: "On retire P (dernier entré). La pile contient H au sommet, puis X dessous." }] },
        { n: "1.5", pts: "1,5 pt", q: [{ t: "p", v: "Décrire l'algorithme qui inverse une file à l'aide d'une pile." }],
          indice: "Une pile inverse l'ordre ; une 2e file recopierait à l'identique.",
          c: [{ t: "list", v: [
            "Déclarer et initialiser une pile vide P.",
            "Tant que F non vide : défiler F, empiler dans P.",
            "Tant que P non vide : dépiler P, enfiler dans F.",
          ]}] },
      ]},
      { title: "Exercice 2 — Compréhension de code", items: [
        { n: "2", pts: "3 pts", q: [{ t: "p", v: "toPost() transforme une expression infixe en postfixe via une pile d'opérateurs. Que retourne toPost(\"(14*((9-3)+(817/2)))\") ?" }],
          indice: "Les chiffres sont copiés ; les opérateurs sont empilés puis ressortis à chaque parenthèse fermante.",
          c: [{ t: "p", v: "L'expression postfixée obtenue est :" },
              { t: "code", v: `14 9 3 - 817 2 / + *` }] },
      ]},
      { title: "Exercice 3 — Structures, files et file de priorité", items: [
        { n: "3.1", pts: "1 pt", q: [{ t: "p", v: "Définir le type t_patient (numéro de sécu sur 13 caractères, nom dynamique, priorité entière)." }],
          indice: "Le numéro de sécu a une taille fixe (+1 pour le \\0) ; le nom est un char*.",
          c: [{ t: "code", v: `typedef struct {
    char num_secu[14];   // 13 caracteres + '\\0'
    char *nom;           // chaine dynamique
    int  priorite;
} t_patient;` }] },
        { n: "3.2", pts: "2 pts", q: [{ t: "p", v: "Écrire initPatient : saisir le numéro de sécu et le nom (champ dynamique à allouer), priorité initialisée à 0." }],
          indice: "Schéma chaîne dynamique : fgets → strcspn → malloc(strlen+1) → strcpy.",
          c: [{ t: "code", v: `void initPatient(t_patient *p) {
    char buf[100];
    printf("Numero de securite sociale : ");
    fgets(buf, sizeof(buf), stdin);
    buf[strcspn(buf, "\\n")] = '\\0';
    strncpy(p->num_secu, buf, 13);
    p->num_secu[13] = '\\0';

    printf("Nom : ");
    fgets(buf, sizeof(buf), stdin);
    buf[strcspn(buf, "\\n")] = '\\0';
    p->nom = malloc(strlen(buf) + 1);
    if (p->nom == NULL) exit(1);
    strcpy(p->nom, buf);

    p->priorite = 0;
}` }] },
        { n: "3.3", pts: "1 pt", q: [{ t: "p", v: "Écrire saisirPriorite : saisie d'une priorité entière entre 1 et 4, blindée par une boucle." }],
          indice: "Boucle do…while qui répète tant que la valeur est hors de [1 ; 4].",
          c: [{ t: "code", v: `void saisirPriorite(t_patient *p) {
    int prio;
    do {
        printf("Priorite (1 a 4) : ");
        scanf("%d", &prio);
    } while (prio < 1 || prio > 4);
    p->priorite = prio;
}` }] },
        { n: "3.4", pts: "2 pts", q: [{ t: "p", v: "Écrire gererPatient : défile un patient de la file d'attente, demande sa priorité, l'insère dans le tas." }],
          indice: "defiler renvoie un void* à caster ; construire un t_noeud avec cle = priorité.",
          c: [{ t: "code", v: `void gererPatient(t_file *attente, t_tas *priorites) {
    if (fileVide(attente)) return;
    t_patient *p = (t_patient*) defiler(attente);
    saisirPriorite(p);
    t_noeud nouveau;
    nouveau.cle  = p->priorite;
    nouveau.data = p;
    ajouter_au_tas(priorites, nouveau);
}` }] },
        { n: "3.5", pts: "5 pts", q: [{ t: "p", v: "Compléter le main : initialiser file et tas, enfiler 10 patients, les gérer, puis tout libérer." },
          { t: "code", v: `int main() {
    t_file f;  t_tas t;
    ____ ;                 // initialiser la file
    ____ ;                 // initialiser le tas (5 niveaux)
    t_patient *p;
    for (int i = 0; i < 10; i++) {
        p = ____ ;          // allouer
        saisirPatient(p);
        ____ ;              // enfiler
    }
    while (fileVide(&f) != 1)
        gererPatient(__, __);
    while ( ____ ) {        // tant que le tas n'est pas vide
        p = ____ ;          // retirer du tas
        ____ ;              // liberer le nom
        ____ ;              // liberer le patient
    }
    return 0;
}` }],
          indice: "init_file / init_tas / malloc(sizeof(t_patient)) / enfiler / !tasVide / supprimer_du_tas / free(p->nom) / free(p).",
          c: [{ t: "code", v: `int main() {
    t_file f;  t_tas t;
    init_file(&f);
    init_tas(&t, 5);
    t_patient *p;
    for (int i = 0; i < 10; i++) {
        p = (t_patient*) malloc(sizeof(t_patient));
        saisirPatient(p);
        enfiler(&f, p);
    }
    while (fileVide(&f) != 1)
        gererPatient(&f, &t);
    while (!tasVide(&t)) {
        p = (t_patient*) supprimer_du_tas(&t);
        free(p->nom);    // d'abord le champ dynamique
        free(p);         // puis la structure
    }
    return 0;
}` }] },
      ]},
    ],
    conseils: [
      "Le schéma de saisie d'une chaîne dynamique tombe à chaque partiel : connais-le par cœur.",
      "Dans le main : init → boucle de remplissage → traitement → libération, toujours dans cet ordre.",
      "La file d'attente est FIFO ; le tas trie par priorité : ne pas confondre les deux conteneurs.",
    ],
    erreurs: [
      "free(p) avant free(p->nom) → fuite mémoire.",
      "Oublier de caster le void* retourné par defiler / supprimer_du_tas.",
      "Oublier de tester le retour de malloc.",
    ],
  },
  {
    id: "a-info-2", subject: "info", level: "reel", duration: 90, bareme: 20,
    title: "Partiel de rattrapage ING1 2025 — Parking intelligent",
    tags: ["structures", "files", "pointeurs", "fichiers"],
    revision: {
      evalue: "La gestion d'une file par liste chaînée avec recherche conditionnelle, les structures à champ dynamique, et la compréhension fine du comportement des pointeurs.",
      tombe: "Le parcours d'une liste avec courant/precedent pour détacher un maillon, et les questions-pièges sur le buffer et le free reviennent souvent.",
      comment: "Revoir la fiche Listes chaînées (suppression d'un maillon) et la fiche Structures, puis faire le sujet en conditions d'examen.",
      fiches: ["i-liste", "i-struct", "i-ptr", "i-fich"],
      exos: ["x-i2", "x-i5", "x-i8"],
    },
    parts: [
      { title: "Partie 1 — Structures et concepts", items: [
        { n: "Q1", pts: "1 pt", q: [{ t: "p", v: "Quelle structure de données est la plus adaptée pour une file d'attente où certaines voitures sont prioritaires ?" }],
          indice: "Ni une pile, ni un tri complet à chaque insertion.",
          c: [{ t: "p", v: "Une liste chaînée avec recherche conditionnelle : elle permet de parcourir la file pour trouver la première voiture prioritaire, sans trier tout l'ensemble." }] },
        { n: "Q2", pts: "1 pt", q: [{ t: "p", v: "Justifier ce choix." }],
          indice: "Comparer au coût d'un tri répété ou d'une pile.",
          c: [{ t: "p", v: "Une pile ne respecte ni l'ordre d'arrivée ni la priorité. Trier à chaque insertion serait inefficace. La liste chaînée garde la logique FIFO tout en autorisant une gestion dynamique des priorités." }] },
      ]},
      { title: "Partie 2 — Structure t_voiture", items: [
        { n: "Q3", pts: "1,5 pt", q: [{ t: "p", v: "Définir la structure t_voiture : plaque (chaîne dynamique), heure d'arrivée (0-23), indicateur prioritaire (0/1)." }],
          indice: "La plaque est un char* (longueur variable, plaques étrangères).",
          c: [{ t: "code", v: `typedef struct {
    char *plaque;        // chaine dynamique
    int  heure_arrivee;  // de 0 a 23
    int  prioritaire;    // 0 = non, 1 = oui
} t_voiture;` }] },
        { n: "Q4", pts: "3,5 pts", q: [{ t: "p", v: "Pourquoi la plaque est-elle allouée dynamiquement (malloc) plutôt que stockée dans un tableau de taille fixe ?" }],
          indice: "Penser aux plaques de longueurs différentes.",
          c: [{ t: "p", v: "L'allocation dynamique ajuste la taille à la longueur réelle de la plaque (formats français, étrangers, longueurs variables). Un tableau statique gaspillerait de la place ou serait trop court." }] },
      ]},
      { title: "Partie 3 — Compréhension de code", items: [
        { n: "Q5", pts: "1 pt", q: [{ t: "p", v: "Que se passe-t-il si on oublie de vider le buffer après un scanf() ?" }],
          indice: "Le caractère \\n laissé dans le tampon.",
          c: [{ t: "p", v: "Le '\\n' resté dans le tampon est lu par le fgets ou scanf suivant et fausse la saisie (lecture vide ou décalée)." }] },
        { n: "Q6", pts: "1 pt", q: [{ t: "p", v: "Si on ajoute free(v->plaque) à la fin de initVoiture, que se passe-t-il si on accède ensuite à la plaque ?" }],
          indice: "La zone est libérée.",
          c: [{ t: "p", v: "Accéder à v->plaque après le free provoque un comportement indéfini (accès à une zone mémoire libérée). Il faut libérer la plaque seulement quand la voiture n'est plus utilisée." }] },
        { n: "Q7", pts: "2 pts", q: [{ t: "p", v: "Que vaut la sortie de afficher(&v) pour t_voiture v = { \"AB123CD\", 14, 1 } ?" }],
          indice: "Format : plaque | heure h | statut.",
          c: [{ t: "code", v: `>> AB123CD | 14h | PRIO` }] },
      ]},
      { title: "Partie 4 — Simulation du système", items: [
        { n: "Q8", pts: "3 pts", q: [{ t: "p", v: "Compléter autoriserEntree : chercher la première voiture prioritaire dans la file ; si aucune, autoriser la voiture en tête." }],
          indice: "Parcourir avec courant et precedent ; détacher le maillon trouvé.",
          c: [{ t: "code", v: `void* autoriserEntree(t_file *f) {
    t_maillonF *courant = f->tete, *prec = NULL;
    while (courant &&
           ((t_voiture*)courant->data)->prioritaire == 0) {
        prec = courant;
        courant = courant->suivant;
    }
    if (courant == NULL || courant == f->tete)
        return defiler(f);
    prec->suivant = courant->suivant;
    if (courant == f->fin) f->fin = prec;
    void *data = courant->data;
    free(courant);
    return data;
}` }] },
        { n: "Q9", pts: "1,5 pt", q: [{ t: "p", v: "Si la file est vide, que retourne autoriserEntree ? Comment protéger le main ?" }],
          indice: "Tester le retour avant de l'utiliser.",
          c: [{ t: "code", v: `// autoriserEntree retourne NULL si la file est vide.
t_voiture *v = autoriserEntree(&file);
if (v == NULL) { printf("Aucune voiture\\n"); continue; }` }] },
        { n: "Q10", pts: "3,5 pts", q: [{ t: "p", v: "Compléter le main : enregistrer 5 voitures puis les autoriser selon leur priorité, en libérant la mémoire." }],
          indice: "init_file, boucle malloc + initVoiture + enfiler, puis boucle autoriserEntree + free.",
          c: [{ t: "code", v: `int main() {
    t_file file;
    init_file(&file);
    for (int i = 0; i < 5; i++) {
        t_voiture *v = malloc(sizeof(t_voiture));
        if (!v) exit(1);
        initVoiture(v);
        enfiler(&file, v);
    }
    while (!fileVide(&file)) {
        t_voiture *v = autoriserEntree(&file);
        if (!v) break;
        printf(">> %s | %dh | %s\\n", v->plaque,
               v->heure_arrivee,
               v->prioritaire ? "PRIO" : "standard");
        free(v->plaque);   // d'abord le champ
        free(v);           // puis la structure
    }
    return 0;
}` }] },
      ]},
    ],
    conseils: [
      "Détacher un maillon d'une liste : relier le précédent au suivant, puis free le maillon.",
      "Vider le buffer après chaque scanf avant un fgets.",
      "Toujours tester le retour d'autoriserEntree avant de l'utiliser.",
    ],
    erreurs: [
      "Accéder à un champ après l'avoir libéré.",
      "Oublier de mettre à jour f->fin quand on retire le dernier maillon.",
      "free de la structure avant son champ dynamique.",
    ],
  },
  {
    id: "a-math-1", subject: "math", level: "reel", duration: 90, bareme: 20,
    title: "Partiel Analyse 2 & Algèbre 2 — Systèmes & intégrales",
    tags: ["matrices", "systèmes", "Gauss", "intégrales"],
    revision: {
      evalue: "La résolution d'un système linéaire (méthode de l'inverse et méthode de Gauss) et l'étude de la nature d'intégrales généralisées.",
      tombe: "Écrire un système sous forme AX = B, vérifier det(A) ≠ 0, et appliquer le bon critère de Riemann selon la borne.",
      comment: "Relire les fiches Matrices, Déterminants et Intégrales généralisées, refaire un calcul d'inverse 3×3, puis composer le sujet chronométré.",
      fiches: ["m-mat", "m-det", "m-int"],
      exos: ["x-m2", "x-m3", "x-m4"],
    },
    parts: [
      { title: "Exercice 1 — Système linéaire (6 pts)", items: [
        { n: "1.1", pts: "1 pt", q: [{ t: "p", v: "Écrire sous forme matricielle $AX = B$ le système suivant :" }, { t: "formula", tex: "\\begin{cases} x + 3y + 2z = 2 \\\\ 2x + 7y + 7z = -1 \\\\ 2x + 5y + 2z = 7 \\end{cases}" }],
          indice: "A = coefficients, X = inconnues, B = seconds membres.",
          c: [{ t: "p", v: "On range les coefficients dans $A$, les inconnues dans $X$ et les seconds membres dans $B$ :" }, { t: "formula", tex: "A = \\begin{pmatrix} 1 & 3 & 2 \\\\ 2 & 7 & 7 \\\\ 2 & 5 & 2 \\end{pmatrix} \\qquad X = \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} \\qquad B = \\begin{pmatrix} 2 \\\\ -1 \\\\ 7 \\end{pmatrix}" }] },
        { n: "1.2", pts: "3 pts", q: [{ t: "p", v: "Montrer que $A$ est inversible ($\\det A \\neq 0$), puis indiquer comment résoudre le système par la méthode de l'inverse." }],
          indice: "Développer le déterminant selon une ligne ; si det ≠ 0, X = A⁻¹B.",
          c: [{ t: "p", v: "On calcule $\\det(A)$ par développement selon une ligne. Comme $\\det(A) \\neq 0$, la matrice $A$ est inversible. La solution s'obtient alors par $X = A^{-1} B$, où $A^{-1}$ se calcule par la méthode de Gauss-Jordan appliquée à la matrice augmentée $(A \\,|\\, I)$." }] },
        { n: "1.3", pts: "2 pts", q: [{ t: "p", v: "Décrire la résolution par la méthode de Gauss." }],
          indice: "Échelonner la matrice augmentée (A | B), puis remonter.",
          c: [{ t: "list", v: [
            "Former la matrice augmentée (A | B).",
            "Par opérations sur les lignes, faire apparaître une forme triangulaire.",
            "Remonter de la dernière ligne vers la première pour trouver z, puis y, puis x.",
            "Les deux méthodes (inverse et Gauss) doivent donner la même solution.",
          ]}] },
      ]},
      { title: "Exercice 2 — Intégrales généralisées (6 pts)", items: [
        { n: "2.1", pts: "3 pts", q: [{ t: "p", v: "Calculer, si elle existe, l'intégrale suivante :" }, { t: "formula", tex: "\\int_0^2 \\frac{x}{\\sqrt{4 - x^2}}\\, dx" }],
          indice: "La borne 2 est problématique. Primitive : −√(4−x²).",
          c: [{ t: "code", v: `Une primitive de x/√(4−x²) est −√(4−x²).

∫₀^X x/√(4−x²) dx = [−√(4−x²)]₀^X
                  = −√(4−X²) + 2

lim(X→2⁻) ( −√(4−X²) + 2 ) = 2   (finie)

⟹ l'intégrale converge et vaut 2.` }] },
        { n: "2.2", pts: "3 pts", q: [{ t: "p", v: "Étudier la nature (convergence ou divergence) de l'intégrale :" }, { t: "formula", tex: "\\int_1^{+\\infty} \\frac{dx}{x\\sqrt{x}}" }],
          indice: "x·√x = x^(3/2) : intégrale de Riemann.",
          c: [{ t: "code", v: `1/(x·√x) = 1/x^(3/2)

C'est une intégrale de Riemann à l'infini
avec α = 3/2 > 1.

⟹ l'intégrale CONVERGE.` }] },
      ]},
    ],
    conseils: [
      "Vérifier det(A) ≠ 0 avant d'annoncer que le système a une solution unique.",
      "Pour une intégrale généralisée : toujours identifier la borne problématique d'abord.",
      "Riemann : α > 1 à l'infini, β < 1 en 0.",
    ],
    erreurs: [
      "Confondre méthode de l'inverse et méthode de Gauss.",
      "Oublier de passer par la limite pour une intégrale généralisée.",
      "Erreur de signe dans le calcul de la primitive.",
    ],
  },
  {
    id: "a-meca-1", subject: "meca", level: "reel", duration: 90, bareme: 20,
    title: "Partiel ING1 2025 — Oscillations et onde mécanique",
    tags: ["TEC", "ressorts", "oscillateur amorti", "pendule"],
    revision: {
      evalue: "Le théorème de l'énergie cinétique, les ressorts équivalents, et la mise en équation d'un oscillateur amorti par méthode énergétique.",
      tombe: "La mise en équation d'un pendule amorti, l'identification du régime, et l'expression du temps caractéristique tombent régulièrement.",
      comment: "Relire les fiches Énergie mécanique, Oscillateur harmonique et Oscillateur amorti, refaire la mise en équation par dEm/dt, puis faire le sujet en mode examen.",
      fiches: ["me-em", "me-osc", "me-amort", "me-trav"],
      exos: ["x-c1", "x-c2", "x-c3"],
    },
    parts: [
      { title: "Exercice 1 — Cours", items: [
        { n: "1.1", pts: "1,5 pt", q: [{ t: "p", v: "Donner la forme mathématique du théorème de l'énergie cinétique (TEC)." }],
          indice: "Variation d'énergie cinétique et travaux.",
          c: [{ t: "p", v: "Théorème de l'énergie cinétique :" }, { t: "formula", tex: ["\\Delta E_c = E_c(B) - E_c(A) = \\sum W_{\\text{forces}}", "E_c = \\frac{1}{2} m v^2"] }] },
        { n: "1.2", pts: "1,5 pt", q: [{ t: "p", v: "Donner la relation de la constante de raideur équivalente pour deux ressorts en série." }],
          indice: "En série, ce sont les inverses qui s'additionnent.",
          c: [{ t: "p", v: "Pour deux ressorts en série, ce sont les inverses des raideurs qui s'additionnent :" }, { t: "formula", tex: "\\frac{1}{k_{eq}} = \\frac{1}{k_1} + \\frac{1}{k_2}" }, { t: "p", v: "(en parallèle, on aurait au contraire $k_{eq} = k_1 + k_2$)." }] },
      ]},
      { title: "Exercice 2 — Pendule amorti", items: [
        { n: "2.1", pts: "2 pts", q: [{ t: "p", v: "Un pendule d'angle $\\theta(t)$ subit un frottement $\\vec{f} = -\\lambda \\vec{v}$. Donner l'expression de l'énergie cinétique et de l'énergie potentielle (petits angles)." }],
          indice: "Ec dépend de θ̇ ; Ep de pesanteur pour un pendule, en petits angles ∝ θ².",
          c: [{ t: "p", v: "Dans l'approximation des petits angles :" }, { t: "formula", tex: ["E_c = \\frac{1}{2} m L^2 \\dot{\\theta}^2", "E_p = \\frac{1}{2} m g L\\, \\theta^2"] }] },
        { n: "2.2", pts: "3 pts", q: [{ t: "p", v: "Par une méthode énergétique, déterminer l'équation différentielle du mouvement dans l'approximation des petits angles." }],
          indice: "dEm/dt = puissance des frottements = −λ(Lθ̇)².",
          c: [{ t: "p", v: "On écrit l'énergie mécanique :" }, { t: "formula", tex: "E_m = E_c + E_p = \\frac{1}{2} m L^2 \\dot{\\theta}^2 + \\frac{1}{2} m g L\\, \\theta^2" }, { t: "p", v: "On la dérive et on l'identifie à la puissance des frottements :" }, { t: "formula", tex: ["m L^2 \\dot{\\theta}\\ddot{\\theta} + m g L\\, \\theta\\dot{\\theta} = -\\lambda L^2 \\dot{\\theta}^2", "m L^2 \\ddot{\\theta} + \\lambda L^2 \\dot{\\theta} + m g L\\, \\theta = 0", "\\ddot{\\theta} + \\frac{\\lambda}{m}\\dot{\\theta} + \\frac{g}{L}\\theta = 0"] }] },
        { n: "2.3", pts: "2 pts", q: [{ t: "p", v: "Donner l'expression du temps caractéristique $\\tau$ et son interprétation physique." }],
          indice: "τ apparaît dans le terme d'amortissement (coefficient de θ̇).",
          c: [{ t: "p", v: "Le terme d'amortissement est $\\frac{\\lambda}{m}\\dot{\\theta}$ ; on pose $\\tau = \\frac{m}{\\lambda}$. C'est le temps caractéristique d'amortissement : il mesure la durée au bout de laquelle l'amplitude des oscillations a notablement décru (enveloppe en $e^{-t/\\tau}$)." }] },
        { n: "2.4", pts: "3 pts", q: [{ t: "p", v: "À quelle condition sur le facteur de qualité a-t-on un régime pseudo-périodique ? Donner alors la forme de $\\theta(t)$ et la pseudo-période." }],
          indice: "Pseudo-périodique : Q > 1/2.",
          c: [{ t: "p", v: "Le régime est pseudo-périodique lorsque :" }, { t: "formula", tex: "Q > \\frac{1}{2}" }, { t: "p", v: "L'angle s'écrit alors :" }, { t: "formula", tex: "\\theta(t) = A\\, e^{-t/\\tau} \\cos(\\omega t + \\varphi)" }, { t: "p", v: "avec une pseudo-période $T = \\frac{2\\pi}{\\omega}$ et $\\omega < \\omega_0$." }] },
      ]},
      { title: "Exercice 3 — Lecture de courbe", items: [
        { n: "3.1", pts: "2,5 pts", q: [{ t: "p", v: "La courbe $\\theta(t)$ oscille en diminuant d'amplitude. Confirmer le régime et expliquer ce que devient l'énergie mécanique." }],
          indice: "Oscillation + atténuation + force non conservative.",
          c: [{ t: "p", v: "La courbe oscille en s'atténuant : c'est bien le régime pseudo-périodique. L'énergie mécanique n'est pas conservée — la force de frottement est non conservative, donc $\\Delta E_m = W_{\\text{frott}} < 0$. L'énergie est dissipée sous forme de chaleur, ce qui explique la décroissance de l'amplitude." }] },
        { n: "3.2", pts: "1 pt", q: [{ t: "p", v: "Comment lirait-on la pseudo-période sur la courbe ?" }],
          indice: "Distance entre deux passages identiques.",
          c: [{ t: "p", v: "La pseudo-période $T$ se lit comme la durée entre deux maxima successifs (ou deux passages par zéro dans le même sens) de la courbe $\\theta(t)$." }] },
      ]},
    ],
    conseils: [
      "La méthode énergétique (dEm/dt) est souvent plus rapide que le bilan des forces.",
      "Vérifier l'homogénéité : τ est un temps, ω une pulsation.",
      "Reconnaître le régime à l'allure de la courbe avant tout calcul.",
    ],
    erreurs: [
      "Oublier le signe − dans la puissance des frottements.",
      "Confondre série et parallèle pour les ressorts.",
      "Croire que Em est conservée alors qu'il y a des frottements.",
    ],
  },
  {
    id: "a-elec-1", subject: "elec", level: "reel", duration: 90, bareme: 20,
    title: "DS2 Électronique S2 2021-2022 — Thévenin/Norton & AOP",
    tags: ["Thévenin", "Norton", "hystérésis", "AOP"],
    revision: {
      evalue: "Les théorèmes de Thévenin et Norton (sources indépendantes ET liées), le comparateur à hystérésis (trigger de Schmitt) et l'AOP idéal en régime linéaire avec le théorème de Millman.",
      tombe: "Le calcul de Rth/Eth et Rn/In par la méthode imposée, le courant dans une charge par diviseur de courant, les seuils VH/VL d'un trigger, et l'AOP idéal (V+ = V−, i+ = i− = 0).",
      comment: "Revoir les fiches Lois fondamentales, AOP et Méthode avant de refaire le sujet. Bien distinguer : on éteint les sources INDÉPENDANTES pour Rth, mais on garde les sources liées en injectant un générateur de test. Correction retranscrite des copies manuscrites du DS.",
      fiches: ["e-lois", "e-aop", "e-methode", "e-cl"],
      exos: ["x-e14", "x-e15", "x-e16"],
    },
    parts: [
      { title: "Exercice 1 — Théorèmes Thévenin/Norton, sources indépendantes (6 pts)", items: [
        { n: "1.1", pts: "2 pts", q: [
            { t: "p", v: "Circuit : un générateur $3\\,\\text{V}$, des résistances $6\\,\\Omega$, $5\\,\\Omega$ et $2\\,\\Omega$, une source de courant $1\\,\\text{A}$, et une charge $R_c = 3\\,\\Omega$ entre A et B. Déterminer $R_{th}$ et $E_{th}$ du générateur de Thévenin à gauche de A et B (méthode imposée : Thévenin)." },
          ],
          indice: "Rth : on éteint les sources indépendantes (le 3 V devient un court-circuit, le 1 A un circuit ouvert). Eth : c'est la tension à vide UAB, charge Rc retirée.",
          c: [
            { t: "schema", name: "thevenin", legend: "Le générateur de Thévenin équivalent : Eth en série avec Rth, vu des bornes A et B." },
            { t: "p", v: "Calcul de $R_{th}$ — on éteint les sources indépendantes : le générateur $3\\,\\text{V}$ devient un court-circuit, la source $1\\,\\text{A}$ un circuit ouvert. On calcule la résistance vue entre A et B :" },
            { t: "formula", tex: "R_{th} = 2\\,\\Omega" },
            { t: "p", v: "Calcul de $E_{th}$ — c'est la tension à vide $U_{AB}$ ($R_c$ retirée, sources actives). La résistance de $2\\,\\Omega$ est traversée par le courant $1\\,\\text{A}$, d'où par la loi d'Ohm :" },
            { t: "formula", tex: "E_{th} = -2 \\times 1 = -2\\,\\text{V}" },
            { t: "p", v: "Résultats du DS : Rth = 2 Ω et Eth = -2 V (bien dans les fourchettes 1,8-2,0 Ω et -2,0 à -1,8 V)." },
          ] },
        { n: "1.2", pts: "2 pts", q: [
            { t: "p", v: "Déterminer $R_n$ et $I_n$ du générateur de Norton (méthode imposée : Norton). $I_n$ est orienté de A vers B." },
          ],
          indice: "In est le courant de court-circuit entre A et B. Rn = Rth.",
          c: [
            { t: "schema", name: "norton", legend: "Le générateur de Norton équivalent : In en parallèle avec Rn (Rn = Rth)." },
            { t: "p", v: "Calcul de $I_n$ — on court-circuite A et B, toutes sources actives. La résistance de $2\\,\\Omega$ se retrouve court-circuitée : on la retire. Le schéma donne directement :" },
            { t: "formula", tex: "I_n = -1\\,\\text{A} \\quad (\\text{orienté de A vers B})" },
            { t: "p", v: "Par définition, $R_n = R_{th}$ :" },
            { t: "formula", tex: "R_n = 2\\,\\Omega" },
            { t: "p", v: "Résultats du DS : In = -1 A et Rn = 2 Ω." },
          ] },
        { n: "1.3", pts: "2 pts", q: [
            { t: "p", v: "En déduire l'intensité $i_o$ traversant la charge $R_c = 3\\,\\Omega$." },
          ],
          indice: "Avec le modèle de Norton (In // Rn) et la charge Rc, c'est un diviseur de courant.",
          c: [
            { t: "p", v: "Avec le modèle de Norton ($I_n$ en parallèle avec $R_n$) et la charge $R_c$, on applique le diviseur de courant :" },
            { t: "formula", tex: ["i_o = \\frac{R_n}{R_n + R_c} \\cdot I_n", "i_o = \\frac{2}{2 + 3} \\cdot (-1) = -\\frac{2}{5} = -0,4\\,\\text{A}"] },
            { t: "p", v: "Résultat du DS : io = -0,4 A (dans la fourchette -0,6 à -0,3 A)." },
          ] },
      ]},
      { title: "Exercice 2 — Théorème de Thévenin, sources liées (4 pts)", items: [
        { n: "2", pts: "4 pts", q: [
            { t: "p", v: "Circuit avec une source de courant indépendante $I_o = 2\\,\\text{A}$, des résistances $5\\,\\Omega$ et $3\\,\\Omega$, et une source de tension LIÉE de valeur $i_o$ (en volts). Charge $R_c = 10\\,\\Omega$ entre A et B. Déterminer $R_{th}$ et $E_{th}$ du générateur de Thévenin à gauche de A et B." },
          ],
          indice: "Avec une source liée, on ne l'éteint PAS. Pour Rth : on éteint seulement les sources indépendantes et on injecte un générateur de test (tension V, courant I) → Rth = V/I.",
          c: [
            { t: "p", v: "Calcul de $R_{th}$ — on éteint la source indépendante (le $2\\,\\text{A}$ devient un circuit ouvert) et on branche un générateur de test $1\\,\\text{V}$. La source liée vaut $U = i_o$ ; or ici $i_o = 0$, donc $U = 0$ : on la remplace par un fil. Le générateur de test ne voit plus qu'une résistance de $3\\,\\Omega$ :" },
            { t: "formula", tex: "I = \\frac{1}{3}\\,\\text{A} \\;\\Rightarrow\\; R_{th} = \\frac{V}{I} = \\frac{1}{1/3} = 3\\,\\Omega" },
            { t: "p", v: "Calcul de $E_{th}$ — tension à vide $U_{AB}$, toutes les sources actives. La résistance de $3\\,\\Omega$ côté A n'est reliée à rien (charge retirée) : aucun courant ne la traverse, on la retire. La source liée vaut alors $U = i_o = 2\\,\\text{V}$, d'où directement :" },
            { t: "formula", tex: "E_{th} = 2\\,\\text{V}" },
            { t: "p", v: "Résultats du DS : Rth = 3 Ω et Eth = 2 V (fourchettes 2,0-5,0 Ω et 1,9-2,2 V)." },
          ] },
      ]},
      { title: "Exercice 3 — Comparateur à hystérésis / trigger de Schmitt (5 pts)", items: [
        { n: "3.1", pts: "1 pt", q: [
            { t: "p", v: "AOP idéal en comparateur inverseur à hystérésis : $V_{in}$ sur l'entrée −, $R_2 = 2\\,\\text{k}\\Omega$ ramène la sortie vers l'entrée +, $R_1 = 1\\,\\text{k}\\Omega$ relie + à la masse. $V_{sat} = 14\\,\\text{V}$. Tracer $V_{out} = f(V_d)$ avec $V_d = V^+ - V^-$." },
          ],
          indice: "La réaction passe par l'entrée + : l'AOP est saturé.",
          c: [
            { t: "schema", name: "aop-schmitt", legend: "La réaction passe par l'entrée + (pont R1/R2) : c'est ce qui crée l'hystérésis." },
            { t: "p", v: "L'AOP est en saturation : si $V_d > 0$ alors $V_{out} = +V_{sat}$ ; si $V_d < 0$ alors $V_{out} = -V_{sat}$. La caractéristique $V_{out} = f(V_d)$ est une marche verticale en $V_d = 0$." },
          ] },
        { n: "3.2", pts: "2 pts", q: [
            { t: "p", v: "Calculer $V_H$, la valeur de $V_{in}$ pour laquelle $V_{out}$ bascule de $+V_{sat}$ à $-V_{sat}$." },
          ],
          indice: "Le basculement a lieu quand V+ = V−. Or V− = Vin et V+ se lit avec le diviseur de tension R1/(R1+R2) appliqué à Vout = +Vsat.",
          c: [
            { t: "p", v: "Quand $V_{out} = +V_{sat}$, l'entrée + se lit par diviseur de tension et $V^- = V_{in}$. Le basculement a lieu lorsque $V^+ = V^-$ :" },
            { t: "formula", tex: "V_H = \\frac{R_1}{R_1 + R_2} \\cdot V_{sat} = \\frac{1}{1 + 2} \\times 14 = 4,7\\,\\text{V}" },
            { t: "p", v: "Résultat du DS : VH = 4,7 V." },
          ] },
        { n: "3.3", pts: "1 pt", q: [
            { t: "p", v: "Calculer $V_L$, le seuil de basculement bas." },
          ],
          indice: "Même raisonnement, mais avec Vout = −Vsat.",
          c: [
            { t: "p", v: "Même raisonnement, cette fois avec $V_{out} = -V_{sat}$ :" },
            { t: "formula", tex: "V_L = -\\frac{R_1}{R_1 + R_2} \\cdot V_{sat} = -4,7\\,\\text{V}" },
            { t: "p", v: "Résultat du DS : VL = −4,7 V. Les deux seuils sont symétriques." },
          ] },
        { n: "3.4", pts: "1 pt", q: [
            { t: "p", v: "Tracer la caractéristique $V_{out} = f(V_{in})$ et proposer un exemple d'utilisation." },
          ],
          indice: "Entre VL et VH, la sortie dépend de l'histoire du signal : c'est le cycle d'hystérésis.",
          c: [
            { t: "p", v: "La caractéristique est un cycle d'hystérésis entre $V_L = -4,7\\,\\text{V}$ et $V_H = +4,7\\,\\text{V}$ (comparateur inverseur : tant que $V_{in} < V_H$, $V_{out} = +V_{sat}$ ; dès que $V_{in} > V_H$, $V_{out} = -V_{sat}$). Les flèches indiquent le sens de parcours du cycle." },
            { t: "p", v: "Utilisation (réponse du DS) : mettre en forme un signal bruité — les deux seuils évitent les basculements parasites dus au bruit." },
          ] },
      ]},
      { title: "Exercice 4 — AOP idéal & théorème de Millman (5 pts)", items: [
        { n: "4.1", pts: "1 pt", q: [
            { t: "p", v: "Donner les caractéristiques de l'AOP idéal." },
          ],
          indice: "Pense aux impédances et aux courants d'entrée.",
          c: [
            { t: "list", v: ["Résistance d'entrée Re = ∞", "Résistance de sortie Rs = 0", "Gain différentiel Avd = ∞", "Courants d'entrée nuls : i+ = i− = 0"] },
          ] },
        { n: "4.2", pts: "1 pt", q: [
            { t: "p", v: "Le montage a une contre-réaction de la sortie vers l'entrée −. Quel est le régime de l'AOP ? Quelle conséquence pour $V^+$ et $V^-$ ?" },
          ],
          indice: "Réaction sur l'entrée − = contre-réaction.",
          c: [
            { t: "p", v: "Le signal de sortie est réinjecté sur la borne inverseuse : c'est une contre-réaction, qui stabilise la sortie. L'AOP fonctionne donc en régime linéaire. Conséquence : $V^+ = V^-$." },
          ] },
        { n: "4.3", pts: "3 pts", q: [
            { t: "p", v: "Montage : $V_1 = 3\\,\\text{V}$, $R_1 = 5\\,\\text{k}\\Omega$, $R_2 = 2\\,\\text{k}\\Omega$, $R_3 = 2\\,\\text{k}\\Omega$, $R_4 = 10\\,\\text{k}\\Omega$, $R_5 = 4\\,\\text{k}\\Omega$. Avec le théorème de Millman appliqué en $V^+$ et $V^-$, déterminer $V_{out}$." },
          ],
          indice: "V+ se lit avec un diviseur de tension (R1, R4). V− s'obtient par Millman avec R2 et R3. Puis on écrit V+ = V−.",
          c: [
            { t: "p", v: "Calcul de $V^+$ par diviseur de tension :" },
            { t: "formula", tex: "V^+ = \\frac{R_4}{R_1 + R_4} \\cdot V_1 = \\frac{10}{10 + 5} \\times 3 = 2\\,\\text{V}" },
            { t: "p", v: "Calcul de $V^-$ par le théorème de Millman :" },
            { t: "formula", tex: ["V^- = \\frac{V_1/R_2 + V_{out}/R_3}{1/R_2 + 1/R_3}", "V^- = \\frac{3/2 + V_{out}/2}{1/2 + 1/2} = \\frac{3 + V_{out}}{2}"] },
            { t: "p", v: "En régime linéaire $V^- = V^+$, d'où :" },
            { t: "formula", tex: ["\\frac{3 + V_{out}}{2} = 2 \\;\\Rightarrow\\; 3 + V_{out} = 4", "V_{out} = 1\\,\\text{V}"] },
            { t: "p", v: "Résultat du DS : Vout = 1 V (dans la fourchette 0,8-1,1 V)." },
          ] },
      ]},
    ],
    conseils: [
      "Pour Rth : éteindre les sources INDÉPENDANTES (tension → court-circuit, courant → circuit ouvert), mais GARDER les sources liées et injecter un générateur de test.",
      "Eth se lit à vide (charge retirée) ; In se lit en court-circuit (A relié à B). Rn = Rth toujours.",
      "Toujours faire l'application numérique : ce DS interdit les résultats sous forme fractionnaire.",
    ],
    erreurs: [
      "Éteindre une source liée comme une source indépendante.",
      "Oublier le signe (orientation A→B) du courant io.",
      "Confondre VH et VL, ou oublier le facteur R1/(R1+R2) du diviseur.",
      "Appliquer Millman sans vérifier d'abord qu'on est en régime linéaire.",
    ],
  },
  {
    id: "a-elec-2", subject: "elec", level: "reel", duration: 90, bareme: 20,
    title: "DS2 Électronique S2 2020-2021 — Filtrage & analyse du signal",
    tags: ["filtres", "Bode", "Fourier", "découplage"],
    revision: {
      evalue: "Un filtre RC du 1er ordre (schémas équivalents BF/HF, fonction de transfert H(jω), pulsation de coupure, diagrammes de Bode gain et phase) et l'analyse d'un signal périodique (valeur moyenne, valeur efficace, séries de Fourier, condensateur de découplage).",
      tombe: "Le passage par les schémas équivalents pour trouver la nature du filtre, la mise de H(jω) sous forme canonique, le calcul de ωc, et l'analyse de Fourier d'un créneau (moyenne, efficace, parité → Bn = 0).",
      comment: "Revoir les fiches Filtres & Bode et Régime sinusoïdal. S'entraîner à mettre H(jω) sous forme canonique et à raisonner sur les cas limites ω→0 et ω→∞. Correction retranscrite des copies manuscrites du DS.",
      fiches: ["e-filtre", "e-bode", "e-sinus"],
      exos: ["x-e17", "x-e18", "x-e19", "x-e20", "x-e21"],
    },
    parts: [
      { title: "Exercice 1 — Filtrage (12 pts)", items: [
        { n: "1.1", pts: "2 pts", q: [
            { t: "p", v: "Filtre : un générateur sinusoïdal $V_{in}$, puis $R_1$ et $C$ en série, et $R_2$ en sortie ($V_{out}$ aux bornes de $R_2$). Données : $R_1 = 9R$, $R_2 = R$, $R = 10^3\\,\\Omega$, $C = 10^{-6}\\,\\text{F}$. Dessiner les schémas équivalents basse fréquence et haute fréquence." },
          ],
          indice: "Le condensateur a pour impédance Zc = 1/(jCω). Quand ω→0, Zc→∞ ; quand ω→∞, Zc→0.",
          c: [
            { t: "p", v: "Basse fréquence ($\\omega \\to 0$) : $Z_c \\to \\infty$, le condensateur se comporte comme un interrupteur ouvert. Aucun courant ne traverse $R_2$ :" },
            { t: "formula", tex: "V_{out} = 0" },
            { t: "p", v: "Haute fréquence ($\\omega \\to \\infty$) : $Z_c \\to 0$, le condensateur est un simple fil. On obtient un diviseur de tension :" },
            { t: "formula", tex: "V_{out} = \\frac{R_2}{R_1 + R_2} \\cdot V_{in} \\neq 0" },
          ] },
        { n: "1.2", pts: "1,5 pt", q: [
            { t: "p", v: "En déduire la nature du filtre (passe-bas/passe-haut, passif/actif, ordre)." },
          ],
          indice: "Compare Vout en basse et en haute fréquence.",
          c: [
            { t: "p", v: "On a $V_{out} = 0$ en basse fréquence et $V_{out} \\neq 0$ en haute fréquence : le filtre laisse passer les hautes fréquences. Réponses du DS : passe-haut, passif, du 1er ordre." },
          ] },
        { n: "1.3", pts: "1,5 pt", q: [
            { t: "p", v: "Donner $H(j\\omega) = V_{out}/V_{in}$ sous la forme $\\frac{ja}{1 + jb}$, avec $a$ et $b$ en fonction de $R$ et $C$." },
          ],
          indice: "Pont diviseur de tension entre Zc, R1 et R2. Remplace ensuite R1 = 9R et R2 = R.",
          c: [
            { t: "formula", tex: "H(j\\omega) = \\frac{R_2}{R_1 + R_2 + Z_c}", note: "Pont diviseur de tension, avec Zc = 1/(jCω)." },
            { t: "p", v: "Avec $R_1 = 9R$, $R_2 = R$ et $Z_c = \\frac{1}{jC\\omega}$ :" },
            { t: "formula", tex: "H(j\\omega) = \\frac{R}{10R + \\frac{1}{jC\\omega}} = \\frac{jRC\\omega}{1 + 10\\, jRC\\omega}" },
            { t: "p", v: "On identifie : $a = RC\\omega$ et $b = 10\\,RC\\omega$." },
          ] },
        { n: "1.4", pts: "1 pt", q: [
            { t: "p", v: "Mettre $H(j\\omega)$ sous la forme $\\dfrac{j\\omega/\\omega_1}{1 + j\\omega/\\omega_0}$. Calculer $\\omega_0$ et $\\omega_1$." },
          ],
          indice: "Identifie terme à terme avec H = jRCω/(1 + 10jRCω).",
          c: [
            { t: "p", v: "On identifie terme à terme :" },
            { t: "formula", tex: ["jRC\\omega = \\frac{j\\omega}{\\omega_1} \\;\\Rightarrow\\; \\omega_1 = \\frac{1}{RC}", "10\\, jRC\\omega = \\frac{j\\omega}{\\omega_0} \\;\\Rightarrow\\; \\omega_0 = \\frac{1}{10\\,RC}"] },
            { t: "p", v: "Numériquement :" },
            { t: "formula", tex: ["\\omega_1 = \\frac{1}{10^3 \\times 10^{-6}} = 1000\\,\\text{rad/s}", "\\omega_0 = \\frac{1}{10 \\times 10^3 \\times 10^{-6}} = 100\\,\\text{rad/s}"] },
          ] },
        { n: "1.5", pts: "2 pts", q: [
            { t: "p", v: "Déterminer la pulsation de coupure $\\omega_c$ du filtre (on doit vérifier $95 < \\omega_c < 102\\,\\text{rad/s}$)." },
          ],
          indice: "À ωc, le gain vaut |H|max / √2. Le gain maximal est atteint quand ω → ∞.",
          c: [
            { t: "p", v: "Le module de la fonction de transfert est :" },
            { t: "formula", tex: "|H| = \\frac{RC\\omega}{\\sqrt{1 + 100\\,(RC\\omega)^2}}" },
            { t: "p", v: "Quand $\\omega \\to \\infty$, le gain maximal vaut $|H|_{max} = \\frac{1}{10}$. À la coupure, $|H(\\omega_c)| = \\frac{|H|_{max}}{\\sqrt{2}}$ :" },
            { t: "formula", tex: ["10\\sqrt{2}\\;RC\\omega_c = \\sqrt{1 + 100\\,(RC\\omega_c)^2}", "200\\,(RC\\omega_c)^2 = 1 + 100\\,(RC\\omega_c)^2", "100\\,(RC\\omega_c)^2 = 1 \\;\\Rightarrow\\; RC\\omega_c = \\frac{1}{10}", "\\omega_c = \\frac{1}{10\\,RC} = 100\\,\\text{rad/s}"] },
            { t: "p", v: "Résultat du DS : ωc = 100 rad/s." },
          ] },
        { n: "1.6", pts: "4 pts", q: [
            { t: "p", v: "Tracer les diagrammes asymptotiques de Bode en gain (dB) et en phase (rad), en indiquant les pentes et les points caractéristiques." },
          ],
          indice: "Passe-haut du 1er ordre : pente +20 dB/déc avant ωc, plateau à 0 dB après.",
          c: [
            { t: "schema", name: "bode-passehaut", legend: "Gain : pente +20 dB/décade puis plateau à 0 dB ; coupure à -3 dB en ωc." },
            { t: "p", v: "Gain : $+20\\ \\text{dB/décade}$ pour $\\omega < \\omega_c$, puis plateau à $0\\,\\text{dB}$ pour $\\omega > \\omega_c$. Phase : $+\\frac{\\pi}{2}$ en basse fréquence, qui décroît vers $0$ en haute fréquence (passage par $+\\frac{\\pi}{4}$ à $\\omega_c$)." },
          ] },
      ]},
      { title: "Exercice 2 — Analyse du signal (8 pts)", items: [
        { n: "2.1", pts: "2 pts", q: [
            { t: "p", v: "Signal créneau périodique de période $T = 4\\,\\text{s}$ : il vaut $3\\,\\text{V}$ pendant $2\\,\\text{s}$, puis $-1\\,\\text{V}$ pendant $2\\,\\text{s}$. Déterminer la valeur moyenne $\\langle s(t) \\rangle$." },
          ],
          indice: "La valeur moyenne = aire algébrique sur une période, divisée par T.",
          c: [
            { t: "p", v: "La valeur moyenne est l'aire algébrique sur une période, divisée par $T$ :" },
            { t: "formula", tex: ["\\langle s(t) \\rangle = \\frac{1}{T} \\times (\\text{aire sur une période})", "\\langle s(t) \\rangle = \\frac{1}{4}\\big(3 \\times 2 + (-1) \\times 2\\big) = \\frac{6 - 2}{4} = 1\\,\\text{V}"] },
            { t: "p", v: "Résultat du DS : ⟨s(t)⟩ = 1 V." },
          ] },
        { n: "2.2", pts: "2 pts", q: [
            { t: "p", v: "Déterminer la valeur efficace $S$ de ce signal (3 chiffres significatifs)." },
          ],
          indice: "Valeur efficace = racine de la moyenne du carré du signal.",
          c: [
            { t: "p", v: "La valeur efficace est la racine de la moyenne du carré du signal :" },
            { t: "formula", tex: ["S = \\sqrt{\\frac{1}{T} \\int s^2(t)\\, dt}", "S = \\sqrt{\\frac{1}{4}\\big(3^2 \\times 2 + (-1)^2 \\times 2\\big)} = \\sqrt{\\frac{20}{4}} = \\sqrt{5} \\approx 2,24\\,\\text{V}"] },
            { t: "p", v: "Résultat du DS : S ≈ 2,24 V." },
          ] },
        { n: "2.3", pts: "1 pt", q: [
            { t: "p", v: "À l'aide des propriétés de symétrie du signal, déduire la valeur de $B_n$. Justifier." },
          ],
          indice: "Regarde la symétrie par rapport à l'axe des ordonnées.",
          c: [
            { t: "p", v: "Le signal est symétrique par rapport à l'axe des ordonnées : c'est un signal pair. Un signal pair ne contient aucune composante impaire (les sinus), donc $B_n = 0$." },
          ] },
        { n: "2.4", pts: "2 pts", q: [
            { t: "p", v: "Exprimer $A_n$, puis calculer $A_0$, $A_1$ et $A_2$." },
          ],
          indice: "Signal pair → An = (4/T)∫₀^(T/2) s(t)cos(nωt)dt. Découpe l'intégrale sur les deux paliers.",
          c: [
            { t: "formula", tex: "A_n = \\frac{8}{n\\pi} \\sin\\left(\\frac{n\\pi}{2}\\right)", note: "Résultat de l'intégration du créneau (signal pair)." },
            { t: "p", v: "On en déduit les premiers coefficients :" },
            { t: "formula", tex: ["A_0 = \\langle s(t) \\rangle = 1\\,\\text{V}", "A_1 = \\frac{8}{\\pi} \\sin\\left(\\frac{\\pi}{2}\\right) = \\frac{8}{\\pi} \\approx 2,55", "A_2 = \\frac{8}{2\\pi} \\sin(\\pi) = 0"] },
            { t: "p", v: "A1 = 8/π ≈ 2,55 et A2 = 0 sont encadrés sur la copie. A0 est la composante continue, égale à la valeur moyenne (1 V) — la case A0 du corrigé manuscrit a été laissée vide, valeur à confirmer sur le sujet original si besoin." },
          ] },
        { n: "2.5", pts: "1 pt", q: [
            { t: "p", v: "Dessiner l'allure du signal après passage par un filtre passe-bas. Comment s'appelle le condensateur d'un tel filtre et quel est son rôle ?" },
          ],
          indice: "Un passe-bas garde les basses fréquences et coupe les hautes.",
          c: [
            { t: "schema", name: "decouplage", legend: "Le condensateur relié à la masse dérive les hautes fréquences : c'est le condensateur de découplage." },
            { t: "p", v: "Un filtre passe-bas laisse passer les basses fréquences et coupe les hautes : les fronts du créneau (transitions rapides = hautes fréquences) sont arrondis, les paliers (basses fréquences) passent. Le condensateur, relié à la masse, est un condensateur de découplage : il filtre les hautes fréquences en les envoyant à la masse." },
          ] },
      ]},
    ],
    conseils: [
      "En BF le condensateur est un interrupteur ouvert ; en HF c'est un simple fil. C'est la clé pour trouver la nature d'un filtre.",
      "Mettre H(jω) sous forme canonique permet de lire directement ω0, ω1 et la pente.",
      "Pour Fourier : un signal pair → Bn = 0 ; un signal impair → An = 0. La parité fait gagner du temps.",
    ],
    erreurs: [
      "Inverser le comportement du condensateur en BF et en HF.",
      "Oublier le facteur 1/T dans la valeur moyenne ou efficace.",
      "Confondre valeur moyenne (⟨s⟩) et valeur efficace (S).",
      "Rendre un résultat sous forme fractionnaire (interdit dans ce DS).",
    ],
  },
  {
    id: "a-elec-3", subject: "elec", level: "reel", duration: 90, bareme: 20,
    title: "DS1 Électronique S2 2021-2022 — Associations, Millman, superposition, nœuds",
    tags: ["associations", "Millman", "superposition", "nœuds"],
    revision: {
      evalue: "Les associations de résistances série/parallèle et le diviseur de courant, le théorème de Millman, le théorème de superposition, et la méthode des nœuds (avec une source liée).",
      tombe: "Le calcul d'une résistance équivalente puis d'un courant par diviseur de courant, le potentiel d'un nœud par Millman, la décomposition source par source en superposition, et la mise en équations d'un circuit par la méthode des nœuds.",
      comment: "Revoir les fiches Lois fondamentales, Diviseur et Méthode. Bien poser : série puis parallèle pour les associations ; une seule source active à la fois pour la superposition. Correction retranscrite des copies manuscrites du DS.",
      fiches: ["e-lois", "e-div", "e-methode"],
      exos: ["x-e22", "x-e23", "x-e24"],
    },
    parts: [
      { title: "Exercice 1 — Associations de résistances & diviseur de courant (5 pts)", items: [
        { n: "1.1", pts: "3 pts", q: [
            { t: "p", v: "Une source de courant $i_o = 10\\,\\text{A}$ alimente $R_1$ et l'association de $R_2 = 200\\,\\Omega$, $R_3 = 300\\,\\Omega$ et $R_4 = 400\\,\\Omega$. $R_2$ et $R_3$ sont en série, le tout en parallèle avec $R_4$. Déterminer la résistance équivalente $R_{234}$." },
          ],
          indice: "Série : on additionne les résistances. Parallèle : produit sur somme.",
          c: [
            { t: "p", v: "$R_2$ en série avec $R_3$ :" },
            { t: "formula", tex: "R_{23} = R_2 + R_3 = 200 + 300 = 500\\,\\Omega" },
            { t: "p", v: "$R_{23}$ en parallèle avec $R_4$ :" },
            { t: "formula", tex: ["R_{234} = \\frac{R_{23} \\cdot R_4}{R_{23} + R_4}", "R_{234} = \\frac{500 \\times 400}{500 + 400} = \\frac{200000}{900} = 222\\,\\Omega"] },
            { t: "p", v: "Résultat du DS : R234 = 222 Ω." },
          ] },
        { n: "1.2", pts: "2 pts", q: [
            { t: "p", v: "Le courant $i_o = 10\\,\\text{A}$ se partage entre $R_1$ et $R_{234}$. Déterminer $R_1$ pour que le courant qui traverse $R_1$ soit $i_1 = 3\\,\\text{A}$." },
          ],
          indice: "R1 et R234 sont en parallèle sous la source de courant : c'est un diviseur de courant.",
          c: [
            { t: "formula", tex: "i_1 = \\frac{R_{234}}{R_{234} + R_1} \\cdot i_o", note: "Diviseur de courant." },
            { t: "p", v: "On isole $R_1$ :" },
            { t: "formula", tex: ["3 = \\frac{222}{222 + R_1} \\times 10", "3\\,(222 + R_1) = 2220 \\;\\Rightarrow\\; 666 + 3 R_1 = 2220", "R_1 = \\frac{2220 - 666}{3} = \\frac{1554}{3} = 518\\,\\Omega"] },
            { t: "p", v: "Résultat du DS : R1 = 518 Ω (dans la fourchette 500-520 Ω)." },
          ] },
      ]},
      { title: "Exercice 2 — Théorème de Millman (5 pts)", items: [
        { n: "2.1", pts: "3 pts", q: [
            { t: "p", v: "Circuit : $R_1 = 100\\,\\Omega$ relié à $V_1 = 10\\,\\text{V}$, une source de courant $i_2 = 2\\,\\text{A}$, $R_3 = 300\\,\\Omega$ vers la masse, $R_4 = 400\\,\\Omega$ relié à une source de $4\\,\\text{V}$. Déterminer le potentiel $V_A$ aux bornes de $R_3$ par le théorème de Millman." },
          ],
          indice: "Millman : on somme les V/R de chaque branche (et les courants injectés), divisé par la somme des 1/R. Attention au signe selon l'orientation des sources.",
          c: [
            { t: "formula", tex: "V_A = \\frac{\\sum \\frac{V_k}{R_k} + \\sum I_k}{\\sum \\frac{1}{R_k}}", note: "Théorème de Millman au nœud A." },
            { t: "p", v: "On reporte les valeurs branche par branche :" },
            { t: "formula", tex: ["V_A = \\frac{-V_1/R_1 + i_2 + 0/R_3 + 4/R_4}{1/R_1 + 1/R_3 + 1/R_4}", "V_A = \\frac{-10/100 + 2 + 4/400}{1/100 + 1/300 + 1/400}", "V_A = \\frac{-0,1 + 2 + 0,01}{0,01 + 0,00333 + 0,0025} = \\frac{1,91}{0,01583} = 121\\,\\text{V}"] },
            { t: "p", v: "Résultat du DS : VA = 121 V." },
          ] },
        { n: "2.2", pts: "2 pts", q: [
            { t: "p", v: "En déduire l'intensité $i_3$ traversant la résistance $R_3$." },
          ],
          indice: "R3 est entre le potentiel VA et la masse : loi d'Ohm.",
          c: [
            { t: "p", v: "$R_3$ est entre le potentiel $V_A$ et la masse — loi d'Ohm :" },
            { t: "formula", tex: "i_3 = \\frac{V_A - 0}{R_3} = \\frac{121}{300} = 0,4\\,\\text{A}" },
            { t: "p", v: "Résultat du DS : i3 = 0,4 A (dans la fourchette 0,4-0,8 A)." },
          ] },
      ]},
      { title: "Exercice 3 — Théorème de superposition (5 pts)", items: [
        { n: "3.1", pts: "4 pts", q: [
            { t: "p", v: "Circuit avec une source de $24\\,\\text{V}$ (et une résistance $8\\,\\Omega$), une source de $12\\,\\text{V}$, et des résistances $4\\,\\Omega$, $4\\,\\Omega$, $3\\,\\Omega$. Déterminer le potentiel $V_A$ aux bornes de la résistance de $3\\,\\Omega$ par le théorème de superposition (2 schémas attendus)." },
          ],
          indice: "On garde une seule source active à la fois ; les sources de tension éteintes deviennent des court-circuits.",
          c: [
            { t: "p", v: "Source de $12\\,\\text{V}$ seule (source $24\\,\\text{V}$ court-circuitée). On associe les résistances puis on applique un diviseur de tension :" },
            { t: "formula", tex: ["3\\,\\Omega \\parallel 4\\,\\Omega = \\frac{3 \\times 4}{3 + 4} = \\frac{12}{7} \\approx 1,714\\,\\Omega", "V_{A1} = \\frac{1,714}{1,714 + 4} \\times 12 = 3,6\\,\\text{V}"] },
            { t: "p", v: "Source de $24\\,\\text{V}$ seule (source $12\\,\\text{V}$ court-circuitée) : la partie haute du circuit se retrouve coincée entre deux masses, on peut la retirer. Il ne reste plus aucune source côté A :" },
            { t: "formula", tex: "V_{A2} = 0\\,\\text{V}" },
            { t: "p", v: "Par superposition :" },
            { t: "formula", tex: "V_A = V_{A1} + V_{A2} = 3,6 + 0 = 3,6\\,\\text{V}" },
            { t: "p", v: "Résultat du DS : VA = 3,6 V (dans la fourchette 3,5-4,0 V)." },
          ] },
        { n: "3.2", pts: "1 pt", q: [
            { t: "p", v: "Le schéma de cet exercice présente une curiosité. Laquelle ?" },
          ],
          indice: "Compare la contribution de chacune des deux sources au potentiel VA.",
          c: [
            { t: "p", v: "La source de 24 V n'apporte aucune contribution au potentiel du point A : seule la source de 12 V compte. C'est ce qu'a révélé le calcul ($V_{A2} = 0$)." },
          ] },
      ]},
      { title: "Exercice 4 — Méthode des nœuds (5 pts)", items: [
        { n: "4.1", pts: "1 pt", q: [
            { t: "p", v: "Le circuit comporte une source de valeur $2 i_o$. Comment s'appelle ce type de source ?" },
          ],
          indice: "Sa valeur dépend d'un courant du circuit.",
          c: [
            { t: "p", v: "C'est une source dépendante (ou liée) de courant, commandée en courant." },
          ] },
        { n: "4.2", pts: "4 pts", q: [
            { t: "p", v: "Déterminer les potentiels $V_A$, $V_B$ et $V_C$ par la méthode des nœuds (le circuit a une source liée $2 i_o$, une source de $2\\,\\text{A}$ et des résistances $3$, $2$, $5$ et $4\\,\\Omega$)." },
          ],
          indice: "Une loi des nœuds par nœud inconnu (3 nœuds → 3 équations) ; les courants sont exprimés par la loi d'Ohm en fonction des potentiels.",
          c: [
            { t: "p", v: "On écrit la loi des nœuds en A, B et C, puis on remplace chaque courant par les potentiels (loi d'Ohm). Après mise en forme, on obtient le système :" },
            { t: "formula", tex: "\\begin{cases} -5 V_A + 3 V_B + 3 V_C = 0 \\\\ 19 V_B - 4 V_C = 0 \\\\ 5 V_A + 2 V_B - 7 V_C = -20 \\end{cases}" },
            { t: "p", v: "Résolu à la calculatrice :" },
            { t: "formula", tex: "V_A = 4,93\\,\\text{V} \\qquad V_B = 1,43\\,\\text{V} \\qquad V_C = 6,79\\,\\text{V}" },
            { t: "p", v: "Résultats du DS : VA = 4,93 V, VB = 1,43 V, VC = 6,79 V." },
          ] },
      ]},
    ],
    conseils: [
      "Associations : repérer d'abord les résistances en série (on additionne), puis en parallèle (produit sur somme).",
      "Superposition : une seule source active à la fois ; une source de tension éteinte = court-circuit, une source de courant éteinte = circuit ouvert.",
      "Méthode des nœuds : autant d'équations que de potentiels inconnus, courants exprimés par la loi d'Ohm.",
    ],
    erreurs: [
      "Confondre série et parallèle dans une association de résistances.",
      "Oublier d'éteindre les autres sources lors de la superposition.",
      "Se tromper de signe au numérateur du théorème de Millman.",
      "Rendre un résultat sous forme fractionnaire (interdit dans ce DS).",
    ],
  },
];

const SUJETS = [...ANNALES, ...TRAINING];
function sujetsOf(subjectId) {
  return SUJETS.filter((s) => s.subject === subjectId);
}

/* ===== CRITÈRES TERMINAL — questions de code des partiels/annales d'info ===== */
const SUJET_Q_TERMINAL = {
  "a-info-1:3.1": { func: "definir_t_patient", criteres: [
    { l: "Déclare un type (struct / typedef)", k: ["struct", "typedef"] },
    { l: "Numéro de sécu : tableau de 13 caractères", k: ["char", "13"] },
    { l: "Nom : champ dynamique (pointeur char *)", k: ["char *", "char*", "*nom"] },
    { l: "Priorité : entier", k: ["int"] },
  ]},
  "a-info-1:3.2": { func: "initPatient", criteres: [
    { l: "Saisit le numéro de sécu", k: ["scanf", "fgets"] },
    { l: "Alloue le nom dynamiquement (malloc)", k: ["malloc"] },
    { l: "Vérifie le retour de malloc (NULL)", k: ["null"], w: ["malloc"] },
    { l: "Initialise la priorité à 0", k: ["= 0", "=0"] },
  ]},
  "a-info-1:3.3": { func: "saisirPriorite", criteres: [
    { l: "Saisit un entier (scanf)", k: ["scanf"] },
    { l: "Boucle de blindage (while / do…while)", k: ["while", "do"] },
    { l: "Teste l'intervalle 1 à 4", k: ["1", "4"] },
  ]},
  "a-info-1:3.4": { func: "gererPatient", criteres: [
    { l: "Défile un patient de la file d'attente", k: ["defiler"] },
    { l: "Demande sa priorité", k: ["priorit", "saisirpriorite"] },
    { l: "Insère le patient dans le tas", k: ["inserer", "tas", "enfiler"] },
  ]},
  "a-info-1:3.5": { func: "main", criteres: [
    { l: "Initialise la file et le tas", k: ["init"] },
    { l: "Boucle pour enfiler 10 patients", k: ["for", "while"], w: ["enfiler"] },
    { l: "Gère les patients", k: ["gererpatient", "gerer"] },
    { l: "Libère toute la mémoire (free)", k: ["free", "liberer"] },
  ]},
  "a-info-2:Q3": { func: "definir_t_voiture", criteres: [
    { l: "Déclare un type (struct / typedef)", k: ["struct", "typedef"] },
    { l: "Plaque : chaîne dynamique (pointeur)", k: ["char *", "char*", "*plaque"] },
    { l: "Heure d'arrivée : entier", k: ["int"] },
    { l: "Indicateur prioritaire : entier (0/1)", k: ["int"] },
  ]},
  "a-info-2:Q8": { func: "autoriserEntree", criteres: [
    { l: "Parcourt la file (courant)", k: ["courant", "->suiv", "->next"], w: ["while"] },
    { l: "Teste l'indicateur prioritaire", k: ["prioritaire", "priorit"] },
    { l: "Renvoie la première voiture prioritaire", k: ["return"] },
    { l: "Sinon renvoie la tête de file", k: ["tete", "tête"], w: ["return"] },
  ]},
  "a-info-2:Q10": { func: "main", criteres: [
    { l: "Enregistre 5 voitures (boucle)", k: ["for", "while"] },
    { l: "Autorise selon la priorité", k: ["autoriserentree", "autoriser"] },
    { l: "Libère la mémoire (free)", k: ["free", "liberer"] },
  ]},
  "t-info-1:2.1": { func: "definir_t_produit", criteres: [
    { l: "Déclare un type (struct / typedef)", k: ["struct", "typedef"] },
    { l: "Nom : chaîne dynamique (pointeur)", k: ["char *", "char*", "*nom"] },
    { l: "Prix : réel (float / double)", k: ["float", "double"] },
    { l: "Quantité : entier", k: ["int"] },
  ]},
  "t-info-1:2.2": { func: "initProduit", criteres: [
    { l: "Alloue le nom dynamiquement (malloc)", k: ["malloc"] },
    { l: "Vérifie le retour de malloc (NULL)", k: ["null"], w: ["malloc"] },
    { l: "Saisit le prix et la quantité (scanf)", k: ["scanf"] },
    { l: "Manipule le pointeur p correctement", k: ["p->", "->"] },
  ]},
  "t-info-1:3.1": { func: "compterChers", criteres: [
    { l: "Parcourt la file", k: ["defiler"], w: ["while"] },
    { l: "Teste le prix > 100", k: ["> 100", ">100", "prix"] },
    { l: "Compte les produits chers", k: ["++", "+ 1", "+1"] },
    { l: "Restaure la file (inchangée)", k: ["enfiler"] },
  ]},
  "t-info-1:3.2": { func: "main", criteres: [
    { l: "Remplit une file de 5 produits", k: ["for", "while"], w: ["enfiler"] },
    { l: "Compte les produits chers", k: ["compterchers", "compter"] },
    { l: "Libère la mémoire (free)", k: ["free", "liberer"] },
  ]},
  "t-info-2:1.2": { func: "creerTableau", criteres: [
    { l: "Alloue avec malloc (pas un tableau local)", k: ["malloc"] },
    { l: "Borne de boucle correcte (i < n)", k: ["< n", "<n"] },
    { l: "Retourne le pointeur alloué", k: ["return"] },
    { l: "Vérifie le retour de malloc (NULL)", k: ["null"], w: ["malloc"] },
  ]},
  "t-info-2:2.1": { func: "compter", criteres: [
    { l: "Cas de base (liste vide → 0)", k: ["null", "return 0"] },
    { l: "Appel récursif sur la suite", k: ["compter(", "->suiv", "->next"] },
    { l: "Ajoute 1 par maillon", k: ["1 +", "+ 1", "1+"] },
  ]},
  "t-info-2:2.2": { func: "libererListe", criteres: [
    { l: "Parcourt la liste (version itérative)", k: ["while"] },
    { l: "Sauvegarde le maillon suivant avant free", k: ["suiv", "temp", "tmp", "next"] },
    { l: "Libère chaque maillon (free)", k: ["free"] },
  ]},
  "t-info-2:3.1": { func: "sauverEntiers", criteres: [
    { l: "Ouvre le fichier (fopen)", k: ["fopen"] },
    { l: "Vérifie le retour de fopen (NULL)", k: ["null"], w: ["fopen"] },
    { l: "Écrit n puis les entiers (fprintf)", k: ["fprintf", "fputs", "fwrite"] },
    { l: "Ferme le fichier (fclose)", k: ["fclose"], w: ["fopen"] },
  ]},
};

/* ================== MODE DÉBUTANT — "je comprends rien" ================== */

const DEBUTANT = [
  { id: "d-ptr", subject: "info", titre: "C'est quoi un pointeur ?",
    simple: "Un pointeur, c'est une variable qui ne contient pas une valeur, mais l'ADRESSE d'une autre variable. Au lieu de stocker « 5 », il stocke « la case mémoire où se trouve 5 ».",
    analogie: "C'est comme un papier où tu écris le numéro d'une maison, au lieu de décrire la maison. Le papier n'est pas la maison : il dit juste où elle est.",
    exemple: `int x = 5;
int *p = &x;   // p = adresse de x
*p = 9;        // on va a l'adresse, on met 9 -> x vaut 9`,
    erreur: "Oublier l'étoile : p donne l'adresse, *p donne la valeur. Les confondre fausse tout.",
    miniQ: { q: "Que donne *p ?", o: ["L'adresse", "La valeur stockée à cette adresse", "Le type"], a: 1,
      e: "L'étoile (indirection) va chercher la valeur à l'adresse contenue dans p." } },
  { id: "d-malloc", subject: "info", titre: "C'est quoi malloc ?",
    simple: "malloc demande au système un bloc de mémoire pendant que le programme tourne. Tu l'utilises quand tu ne connais la taille qu'à l'exécution. Quand tu as fini, tu rends le bloc avec free.",
    analogie: "C'est comme réserver une table au restaurant pour un nombre de personnes connu seulement le jour même. free, c'est libérer la table en partant.",
    exemple: `int n;  scanf("%d", &n);
int *tab = malloc(n * sizeof(int));
if (tab == NULL) return 1;   // toujours tester !
...
free(tab);                   // rendre la memoire`,
    erreur: "Oublier free → fuite mémoire. Oublier de tester NULL → crash si la mémoire manque.",
    miniQ: { q: "Que retourne malloc s'il échoue ?", o: ["0", "NULL", "-1"], a: 1,
      e: "malloc retourne NULL en cas d'échec : il faut toujours le tester." } },
  { id: "d-struct", subject: "info", titre: "C'est quoi une structure ?",
    simple: "Une structure regroupe plusieurs informations de types différents sous un seul nom. Au lieu de gérer nom, âge et moyenne séparément, tu crées un type t_etudiant qui contient les trois.",
    analogie: "C'est une fiche d'identité : un seul objet « personne » qui contient le nom, la date de naissance, l'adresse…",
    exemple: `typedef struct {
    char nom[20];
    int  age;
} t_etudiant;
t_etudiant e;  e.age = 20;`,
    erreur: "Confondre . et -> : point sur une variable, flèche sur un pointeur.",
    miniQ: { q: "On a un POINTEUR p sur structure. On écrit ?", o: ["p.age", "p->age", "*age"], a: 1,
      e: "Sur un pointeur, on utilise la flèche -> ." } },
  { id: "d-liste", subject: "info", titre: "C'est quoi une liste chaînée ?",
    simple: "Une liste chaînée est une suite de petites boîtes (maillons). Chaque boîte contient une donnée et l'adresse de la boîte suivante. La dernière pointe vers NULL.",
    analogie: "C'est une chasse au trésor : chaque indice te dit où trouver le suivant. Tu suis la chaîne jusqu'au bout.",
    exemple: `typedef struct maillon {
    int data;
    struct maillon *suivant;
} t_maillon;`,
    erreur: "Faire avancer l'ancre tete elle-même : on perd le début de la liste.",
    miniQ: { q: "Le dernier maillon pointe sur ?", o: ["Le premier", "NULL", "Lui-même"], a: 1,
      e: "Le champ suivant du dernier maillon vaut NULL." } },
  { id: "d-dl", subject: "math", titre: "C'est quoi un développement limité ?",
    simple: "Un développement limité (DL) remplace une fonction compliquée par un polynôme simple, valable seulement PRÈS d'un point. Plus on prend de termes, plus l'approximation est précise autour de ce point.",
    analogie: "C'est comme zoomer très fort sur une courbe : de tout près, même une courbe tordue ressemble à une droite, puis à une parabole…",
    exemple: `Pres de 0 :
sin(x) ≈ x − x³/6
eˣ     ≈ 1 + x + x²/2`,
    erreur: "Croire que le DL est valable partout : il n'est bon qu'au voisinage du point choisi.",
    miniQ: { q: "Un DL approche une fonction…", o: ["partout", "près d'un point", "à l'infini seulement"], a: 1,
      e: "Le DL n'est valable qu'au voisinage du point de développement." } },
  { id: "d-int", subject: "math", titre: "C'est quoi une intégrale généralisée ?",
    simple: "C'est une intégrale « normale » mais avec un problème à une borne : soit la borne est l'infini, soit la fonction explose à la borne. On regarde si l'aire reste finie : si oui, l'intégrale converge.",
    analogie: "C'est comme verser de l'eau dans un récipient infiniment long : la question est de savoir si la quantité totale d'eau reste finie ou déborde.",
    exemple: `∫₁^{+∞} dx/x²  converge  (aire finie)
∫₁^{+∞} dx/x   diverge   (aire infinie)`,
    erreur: "Calculer directement sans passer par une limite, ou se tromper de critère de Riemann.",
    miniQ: { q: "Une intégrale généralisée converge si…", o: ["l'aire est finie", "la fonction est positive", "la borne est l'infini"], a: 0,
      e: "Converger = la limite de l'intégrale existe et est finie." } },
  { id: "d-mat", subject: "math", titre: "C'est quoi une matrice ?",
    simple: "Une matrice est un tableau de nombres rangés en lignes et colonnes. Elle sert surtout à représenter et résoudre des systèmes d'équations linéaires d'un seul coup.",
    analogie: "C'est une grille de tableur : chaque case a une ligne et une colonne, et on peut faire des opérations sur toute la grille.",
    exemple: `Le systeme  2x + y = 3
            x − y = 0
s'ecrit  A·X = B`,
    erreur: "Croire que AB = BA : le produit de matrices n'est PAS commutatif.",
    miniQ: { q: "Le produit matriciel est…", o: ["commutatif", "non commutatif", "impossible"], a: 1,
      e: "AB ≠ BA en général." } },
  { id: "d-trav", subject: "meca", titre: "C'est quoi le travail d'une force ?",
    simple: "Le travail d'une force, c'est l'énergie qu'elle transfère à un objet quand il se déplace. Si la force pousse dans le sens du mouvement, le travail est positif (elle aide) ; sinon il est négatif (elle freine).",
    analogie: "Pousser une voiture en panne : si tu pousses dans le sens où elle roule, tu lui donnes de l'énergie. Si tu pousses contre, tu la ralentis.",
    exemple: `W = F⃗ · AB⃗ = F·AB·cos(θ)
θ = 0   : travail moteur (positif)
θ = 180°: travail resistant (negatif)`,
    erreur: "Confondre travail (énergie, en joules) et puissance (énergie par seconde, en watts).",
    miniQ: { q: "Le travail des frottements est…", o: ["positif", "négatif", "nul"], a: 1,
      e: "Les frottements s'opposent au mouvement : travail résistant, donc négatif." } },
  { id: "d-osc", subject: "meca", titre: "C'est quoi un oscillateur ?",
    simple: "Un oscillateur est un système qui, écarté de sa position d'équilibre, est ramené vers elle par une force de rappel — et qui du coup va-et-vient autour de l'équilibre. Exemple : une masse sur un ressort.",
    analogie: "C'est une balançoire : dès que tu l'écartes, la gravité la ramène, elle dépasse, revient… elle oscille.",
    exemple: `Equation : ẍ + ω₀² x = 0
Solution : x(t) = A·cos(ω₀ t + φ)`,
    erreur: "Confondre fréquence f (en Hz) et pulsation ω (en rad/s) : ω = 2πf.",
    miniQ: { q: "Sans frottement, un oscillateur…", o: ["s'arrête vite", "oscille indéfiniment", "accélère"], a: 1,
      e: "Sans amortissement, l'énergie est conservée : il oscille sans s'arrêter." } },
  { id: "d-ohm", subject: "elec", titre: "C'est quoi la loi d'Ohm ?",
    simple: "La loi d'Ohm relie la tension U aux bornes d'une résistance, le courant I qui la traverse et la résistance R : U = R·I. Plus la résistance est grande, plus il faut de tension pour faire passer le même courant.",
    analogie: "C'est un tuyau d'eau : la tension = la pression, le courant = le débit, la résistance = l'étroitesse du tuyau.",
    exemple: `U = R · I
Ex : R = 100 Ω, I = 0,2 A  →  U = 20 V`,
    erreur: "Mélanger les unités (kΩ et Ω, mA et A) avant le calcul.",
    miniQ: { q: "Si R augmente à tension constante, I…", o: ["augmente", "diminue", "ne change pas"], a: 1,
      e: "I = U/R : si R monte, I baisse." } },
  { id: "d-aop", subject: "elec", titre: "C'est quoi un AOP ?",
    simple: "Un amplificateur opérationnel (AOP) est un composant qui amplifie une différence de tension entre ses deux entrées. Avec quelques résistances autour, il peut amplifier, comparer ou filtrer un signal.",
    analogie: "C'est un mégaphone réglable : une petite voix en entrée, une grosse voix en sortie, et le gain dépend du branchement.",
    exemple: `AOP ideal :  i⁺ = i⁻ = 0
En regime lineaire :  V⁺ = V⁻`,
    erreur: "Écrire V⁺ = V⁻ sans contre-réaction sur l'entrée − : l'AOP est alors saturé, pas linéaire.",
    miniQ: { q: "Pour un AOP idéal, les courants d'entrée valent…", o: ["l'infini", "zéro", "1 A"], a: 1,
      e: "Les impédances d'entrée sont infinies : i⁺ = i⁻ = 0." } },
  { id: "d-filtre", subject: "elec", titre: "C'est quoi un filtre ?",
    simple: "Un filtre est un circuit qui laisse passer certaines fréquences et en bloque d'autres. Un passe-bas garde les basses fréquences, un passe-haut garde les hautes.",
    analogie: "C'est un videur de boîte de nuit : il laisse entrer certains (fréquences) et refuse les autres, selon un critère.",
    exemple: `Passe-bas RC : H = 1/(1 + jRCω)
Fréquence de coupure : f_c = 1/(2πRC)`,
    erreur: "Confondre passe-bas et passe-haut en lisant un diagramme de Bode.",
    miniQ: { q: "Un passe-bas laisse passer…", o: ["les hautes fréquences", "les basses fréquences", "toutes"], a: 1,
      e: "Le passe-bas conserve les basses fréquences et atténue les hautes." } },
  { id: "d-bode", subject: "elec", titre: "C'est quoi un diagramme de Bode ?",
    simple: "Un diagramme de Bode est un graphique qui montre comment un filtre se comporte selon la fréquence : une courbe pour le gain (combien il amplifie ou atténue) et une pour le déphasage.",
    analogie: "C'est la carte d'identité sonore d'un filtre : elle dit, pour chaque fréquence, si le filtre la laisse passer fort, faible, ou pas du tout.",
    exemple: `Gain en dB : G_dB = 20·log₁₀(|H|)
Coupure : gain à −3 dB
Pente : −20 dB/décade par ordre`,
    erreur: "Lire le −3 dB sur la courbe de phase au lieu de la courbe de gain.",
    miniQ: { q: "Le gain en dB se calcule par…", o: ["10·log(|H|)", "20·log₁₀(|H|)", "|H|²"], a: 1,
      e: "G_dB = 20·log₁₀(|H|)." } },
];

/* ================== ERREURS FRÉQUENTES ================== */

const ERREURS = [
  { subject: "info", items: [
    { titre: "Oublier le & dans scanf", exp: "scanf doit écrire DANS ta variable : il lui faut son adresse. scanf(\"%d\", n) au lieu de scanf(\"%d\", &n) écrit à une adresse invalide.",
      fix: "Toujours : scanf(\"%d\", &n). Le & est obligatoire (sauf pour les chaînes char[], qui sont déjà des adresses)." },
    { titre: "Oublier free", exp: "Chaque malloc réserve de la mémoire. Sans free, elle n'est jamais rendue : c'est une fuite mémoire qui s'accumule.",
      fix: "Règle : 1 malloc = 1 free. Repère chaque allocation et prévois sa libération." },
    { titre: "Confondre . et ->", exp: "Le point s'utilise sur une variable structure ; la flèche sur un POINTEUR vers une structure.",
      fix: "Variable : e.age. Pointeur : p->age (équivaut à (*p).age)." },
    { titre: "Oublier le cas pile/file vide", exp: "Dépiler une pile vide ou défiler une file vide provoque un crash ou un résultat faux.",
      fix: "Toujours tester pileVide / fileVide avant de retirer un élément." },
    { titre: "Oublier de tester malloc", exp: "Si la mémoire manque, malloc retourne NULL. Utiliser ce pointeur sans test → crash.",
      fix: "Après chaque malloc : if (p == NULL) { ... gérer l'erreur ... }." },
    { titre: "Perdre l'adresse d'un bloc alloué", exp: "Réaffecter un pointeur (p = autre_chose) avant de l'avoir libéré rend son bloc inaccessible : fuite définitive.",
      fix: "Libérer AVANT de réaffecter. Pour realloc, passer par une variable temporaire." },
  ]},
  { subject: "math", items: [
    { titre: "Mauvais ordre de DL", exp: "Faire un produit ou un quotient de DL en ne gardant pas tous les termes nécessaires à l'ordre demandé fausse le résultat.",
      fix: "Avant le calcul, fixe l'ordre n. Garde tous les termes jusqu'à xⁿ et le o(xⁿ)." },
    { titre: "Oublier le reste o(xⁿ)", exp: "Un DL sans son reste o(xⁿ) n'est pas un DL : on perd l'information sur la précision.",
      fix: "Écris toujours le o(xⁿ) à la fin du développement." },
    { titre: "Confondre équivalent et égalité", exp: "f ∼ g signifie « se comportent pareil près du point », pas f = g. On ne remplace pas un équivalent dans une somme.",
      fix: "Les équivalents s'utilisent dans les produits/quotients, jamais dans une somme." },
    { titre: "Erreur dans le produit matriciel", exp: "AB n'est défini que si le nombre de colonnes de A = nombre de lignes de B, et AB ≠ BA.",
      fix: "Vérifie les dimensions ; calcule (AB)ᵢⱼ = somme des Aᵢₖ·Bₖⱼ." },
    { titre: "Mauvais critère pour intégrale généralisée", exp: "Le critère de Riemann dépend de la borne : α>1 à l'infini, β<1 en 0. Les inverser donne la mauvaise conclusion.",
      fix: "Identifie d'abord QUELLE borne pose problème, puis applique le bon critère." },
    { titre: "Erreur de signe dans un déterminant", exp: "Le développement par cofacteurs alterne les signes : (−1)^(i+j). Oublier l'alternance fausse le déterminant.",
      fix: "Applique le damier de signes + − + / − + − / + − +." },
  ]},
  { subject: "meca", items: [
    { titre: "Confondre travail et puissance", exp: "Le travail est une énergie (joules) ; la puissance est une énergie par unité de temps (watts). P = W/Δt.",
      fix: "Question sur une énergie → travail. Question sur un débit d'énergie → puissance." },
    { titre: "Mauvais signe de l'énergie potentielle", exp: "Une erreur de signe ou d'origine sur Ep fausse tout le bilan énergétique.",
      fix: "Fixe clairement l'origine (Ep = 0) et l'axe ; Ep(pesanteur) = mgz avec z orienté vers le haut." },
    { titre: "Oublier les frottements", exp: "Appliquer la conservation de Em alors qu'il y a des frottements donne un résultat faux : Em n'est plus conservée.",
      fix: "Frottements présents → ΔEm = W(frottements) < 0, ou TEC avec le travail des frottements." },
    { titre: "Confondre fréquence et pulsation", exp: "f est en hertz, ω en rad/s. Les utiliser l'une pour l'autre fausse les périodes et les énergies.",
      fix: "Retiens ω = 2πf, et T = 2π/ω = 1/f." },
    { titre: "Mal identifier le régime d'un oscillateur", exp: "Confondre pseudo-périodique, critique et apériodique conduit à la mauvaise forme de solution.",
      fix: "Courbe qui oscille en s'atténuant = pseudo-périodique. Revient sans osciller = critique/apériodique." },
  ]},
  { subject: "elec", items: [
    { titre: "Lire le −3 dB sur la phase", exp: "La fréquence de coupure se lit sur la courbe de GAIN (−3 dB), pas sur la courbe de phase.",
      fix: "Coupure = là où le gain passe à −3 dB (gain divisé par √2)." },
    { titre: "Confondre passe-bas et passe-haut", exp: "Lire un Bode trop vite fait inverser les deux types de filtre.",
      fix: "Gain plat puis chute = passe-bas. Chute puis plat = passe-haut." },
    { titre: "Oublier 20·log pour le gain en dB", exp: "Pour une tension, le gain en dB est 20·log₁₀(|H|), pas 10·log.",
      fix: "Tensions → 20·log₁₀. (Le 10·log concerne les puissances.)" },
    { titre: "Mal compter l'ordre d'un filtre", exp: "L'ordre se lit sur la pente : −20 dB/décade = ordre 1, −40 dB/décade = ordre 2.",
      fix: "Compte la pente après la coupure : un ordre par tranche de −20 dB/décade." },
    { titre: "Confondre AOP idéal et AOP saturé", exp: "V⁺ = V⁻ n'est vrai qu'en régime linéaire (contre-réaction sur −). Sans cela, l'AOP sature.",
      fix: "Vérifie d'abord où arrive la rétroaction avant d'écrire V⁺ = V⁻." },
    { titre: "Oublier les impédances complexes", exp: "En régime sinusoïdal, bobine et condensateur ne sont pas de simples résistances : Z_L = jLω, Z_C = 1/(jCω).",
      fix: "Passe en impédances complexes ; le diviseur de tension reste valable avec les Z." },
  ]},
];

/* ================== MÉTHODES TYPES ================== */

const METHODES = [
  { subject: "info", items: [
    { titre: "Écrire une fonction avec pointeur", reconnaitre: "La fonction doit modifier une variable de l'appelant, ou en renvoyer plusieurs.",
      etapes: ["Mettre un paramètre de type pointeur (int *p).", "À l'appel, passer l'adresse (&x).", "Dans la fonction, manipuler *p pour lire/écrire la valeur."] },
    { titre: "Créer une structure dynamique", reconnaitre: "On a besoin d'un objet dont la durée de vie dépasse la fonction, ou avec un champ de taille variable.",
      etapes: ["malloc(sizeof(t_truc)) pour la structure.", "Allouer les champs dynamiques (ex : le nom).", "Remplir les champs.", "Libérer le champ PUIS la structure."] },
    { titre: "Parcourir une liste chaînée", reconnaitre: "On veut visiter tous les maillons (compter, chercher, afficher).",
      etapes: ["Créer un pointeur courant = tete.", "while (courant != NULL).", "Traiter courant->data.", "courant = courant->suivant."] },
    { titre: "Utiliser une pile", reconnaitre: "On a besoin du dernier élément entré, ou d'inverser un ordre.",
      etapes: ["Initialiser la pile.", "empiler pour ajouter.", "Tester pileVide avant de dépiler.", "depiler pour récupérer le sommet."] },
    { titre: "Utiliser une file", reconnaitre: "On traite les éléments dans leur ordre d'arrivée (file d'attente).",
      etapes: ["Initialiser la file.", "enfiler en fin.", "Tester fileVide avant de défiler.", "defiler en tête."] },
    { titre: "Libérer correctement la mémoire", reconnaitre: "Le programme alloue de la mémoire (malloc) qu'il faut rendre.",
      etapes: ["Repérer chaque malloc.", "Pour une structure à champ dynamique : free du champ d'abord.", "Pour une liste : sauvegarder le suivant avant chaque free.", "1 malloc = 1 free."] },
  ]},
  { subject: "math", items: [
    { titre: "Faire un DL", reconnaitre: "On demande un développement limité à un ordre n en un point a.",
      etapes: ["Se ramener en 0 si besoin (X = x − a).", "Écrire les DL usuels nécessaires.", "Combiner (somme, produit, composition).", "Tronquer à l'ordre n + garder o(xⁿ)."] },
    { titre: "Calculer une limite avec un DL", reconnaitre: "Forme indéterminée (0/0, ∞−∞) avec des fonctions usuelles.",
      etapes: ["Faire le DL du numérateur et du dénominateur.", "Garder le premier terme non nul.", "Simplifier le quotient.", "Conclure la limite."] },
    { titre: "Étudier une intégrale généralisée", reconnaitre: "Borne infinie, ou fonction non définie en une borne.",
      etapes: ["Repérer la borne problématique.", "Chercher un équivalent simple de la fonction là-bas.", "Comparer à une intégrale de Riemann.", "Conclure : converge ou diverge."] },
    { titre: "Inverser une matrice", reconnaitre: "On doit résoudre AX = B par la méthode de l'inverse, ou calculer A⁻¹.",
      etapes: ["Vérifier det(A) ≠ 0.", "2×2 : formule directe 1/(ad−bc)·[[d,−b],[−c,a]].", "Sinon : Gauss-Jordan sur (A | I) jusqu'à (I | A⁻¹)."] },
    { titre: "Calculer un déterminant", reconnaitre: "On veut det(A), souvent pour tester l'inversibilité.",
      etapes: ["2×2 : ad − bc.", "3×3 : règle de Sarrus.", "Plus grand : développer selon une ligne/colonne avec des zéros.", "Penser aux propriétés (triangulaire, lignes proportionnelles)."] },
    { titre: "Résoudre un système", reconnaitre: "Plusieurs équations linéaires à plusieurs inconnues.",
      etapes: ["Écrire sous forme AX = B.", "Méthode de Gauss : échelonner (A | B).", "Remonter pour trouver les inconnues.", "Ou X = A⁻¹B si A inversible."] },
  ]},
  { subject: "meca", items: [
    { titre: "Choisir entre TEC, TEM et PFD", reconnaitre: "Question sur une vitesse, une position ou une accélération.",
      etapes: ["Cherche une vitesse sans les forces → TEC ou conservation de Em.", "Frottements présents → TEM (ΔEm = W non conservatif).", "Cherche une accélération ou l'équation du mouvement → PFD."] },
    { titre: "Poser une équation différentielle", reconnaitre: "On demande l'équation du mouvement d'un système.",
      etapes: ["Méthode des forces : PFD, m·a = ΣF, projeter sur l'axe.", "Méthode énergétique : écrire Em, puis dEm/dt = puissance non conservative.", "Simplifier pour obtenir ẍ + … = 0."] },
    { titre: "Reconnaître un oscillateur", reconnaitre: "Le système a une position d'équilibre et une force de rappel.",
      etapes: ["Identifier l'équilibre.", "Vérifier la forme ẍ + ω₀²x = 0.", "Lire la pulsation propre ω₀.", "En déduire T₀ = 2π/ω₀."] },
    { titre: "Exploiter une énergie potentielle", reconnaitre: "Forces conservatives, recherche d'équilibre ou de stabilité.",
      etapes: ["Écrire Ep(x).", "Équilibre : dEp/dx = 0.", "Minimum de Ep → stable ; maximum → instable.", "Em = Ec + Ep pour les bilans."] },
    { titre: "Lire une courbe d'oscillation", reconnaitre: "On fournit un graphe x(t) ou θ(t).",
      etapes: ["Oscille sans s'atténuer → harmonique non amorti.", "Oscille en s'atténuant → pseudo-périodique.", "Revient sans osciller → critique/apériodique.", "Lire période et amplitude sur les axes."] },
  ]},
  { subject: "elec", items: [
    { titre: "Identifier un filtre", reconnaitre: "On donne un circuit RC/RL ou une fonction de transfert.",
      etapes: ["Regarder le comportement en basse et haute fréquence.", "Basses passent → passe-bas ; hautes passent → passe-haut.", "Bosse → passe-bande.", "Confirmer avec H(jω)."] },
    { titre: "Lire un diagramme de Bode", reconnaitre: "On fournit les courbes gain (dB) et phase.",
      etapes: ["Repérer le gain en basse et haute fréquence.", "Trouver la coupure à −3 dB sur le GAIN.", "Mesurer la pente (−20 dB/décade par ordre).", "Conclure le type et l'ordre du filtre."] },
    { titre: "Calculer une fréquence de coupure", reconnaitre: "Filtre RC ou RL, on demande f_c.",
      etapes: ["Identifier la constante de temps (RC ou L/R).", "ω_c = 1/(RC).", "f_c = ω_c/(2π).", "Vérifier les unités."] },
    { titre: "Calculer un gain", reconnaitre: "On demande le gain d'un montage ou |H|.",
      etapes: ["Établir H = Vs/Ve.", "Gain |H| = module.", "Gain en dB = 20·log₁₀(|H|).", "Pour un AOP : appliquer la formule du montage."] },
    { titre: "Analyser un AOP", reconnaitre: "Un montage contient un amplificateur opérationnel.",
      etapes: ["Vérifier la contre-réaction sur l'entrée − (régime linéaire).", "Poser i⁺ = i⁻ = 0.", "Écrire V⁺ = V⁻.", "Loi des nœuds + diviseur de tension pour trouver Vs."] },
    { titre: "Reconnaître une saturation", reconnaitre: "L'AOP n'a pas de contre-réaction sur l'entrée inverseuse.",
      etapes: ["Pas de rétroaction sur − → régime saturé.", "La sortie vaut +Vsat ou −Vsat.", "Le signe dépend de celui de (V⁺ − V⁻).", "Ne pas écrire V⁺ = V⁻."] },
  ]},
];

/* ================== BADGES ================== */

const BADGES = [
  { id: "b-malloc", nom: "Survivant du malloc", icon: "🛡️", desc: "Lire la fiche Allocation dynamique.",
    check: (p) => (p.fiches || []).includes("i-alloc") },
  { id: "b-dl", nom: "Boss des DL", icon: "📐", desc: "Réussir le quiz DL & Intégrales (≥ 70 %).",
    check: (p) => ((p.quiz || {})["qz-math1"]?.pct || 0) >= 70 },
  { id: "b-osc", nom: "Maître des oscillations", icon: "🌊", desc: "Réussir le quiz Oscillations (≥ 70 %).",
    check: (p) => ((p.quiz || {})["qz-meca2"]?.pct || 0) >= 70 },
  { id: "b-bode", nom: "Roi du Bode", icon: "👑", desc: "Réussir le quiz AOP & Filtres (≥ 70 %).",
    check: (p) => ((p.quiz || {})["qz-elec2"]?.pct || 0) >= 70 },
  { id: "b-antipiege", nom: "Anti-pièges", icon: "🎯", desc: "Terminer au moins 8 exercices.",
    check: (p) => (p.exos || []).length >= 8 },
  { id: "b-lecteur", nom: "Lecteur assidu", icon: "📚", desc: "Lire au moins 12 fiches.",
    check: (p) => (p.fiches || []).length >= 12 },
  { id: "b-cartes", nom: "Mémoire d'éléphant", icon: "🐘", desc: "Maîtriser au moins 25 flashcards.",
    check: (p) => Object.values(p.cards || {}).filter((v) => v === "ok").length >= 25 },
  { id: "b-quiz", nom: "Quiz addict", icon: "✓", desc: "Tenter au moins 6 quiz.",
    check: (p) => Object.keys(p.quiz || {}).length >= 6 },
  { id: "b-partiel", nom: "Prêt pour le partiel", icon: "🏆", desc: "Terminer au moins un partiel blanc.",
    check: (p) => (p.partiels || []).length >= 1 },
  { id: "b-marathon", nom: "Marathonien", icon: "🔥", desc: "Terminer 3 partiels blancs.",
    check: (p) => (p.partiels || []).length >= 3 },
];

/* ================== CE QUI TOMBE SOUVENT ================== */

const TOMBE = [
  { subject: "info",
    chapitres: ["Files & piles (FIFO/LIFO)", "Structures à champ dynamique", "Allocation dynamique (malloc/free)", "Listes chaînées", "File de priorité (tas)"],
    exos: ["Compléter un main (init → remplir → traiter → libérer)", "Écrire une fonction de saisie d'une structure", "Parcourir / vider une file ou une pile", "Inverser une file avec une pile", "Compréhension de code (dire ce que fait une fonction)"],
    pieges: ["Oublier le & dans scanf", "free de la structure avant son champ dynamique", "Boucle while(!fileVide) en réenfilant → boucle infinie", "Oublier de tester le retour de malloc", "Ne pas caster le void* renvoyé par defiler"],
    formules: ["Schéma chaîne dynamique : fgets → strcspn → malloc(strlen+1) → strcpy", "Allouer un tableau : malloc(n * sizeof(type))", "p->champ équivaut à (*p).champ"],
    methodes: ["Lire le prototype puis dérouler à la main", "Écrire l'algo en français avant le C", "Toujours libérer dans l'ordre inverse de l'allocation"],
    prioritaires: ["x-i1", "x-i2", "x-i7", "x-i8"], fiches: ["i-ptr", "i-alloc", "i-pf", "i-liste", "i-struct"] },
  { subject: "math",
    chapitres: ["Développements limités", "Intégrales généralisées", "Systèmes linéaires (Gauss)", "Déterminants", "Matrice inverse"],
    exos: ["Calculer un DL puis une limite", "Étudier la nature d'une intégrale généralisée", "Résoudre un système AX = B", "Calculer un déterminant 3×3", "Inverser une matrice 2×2 ou 3×3"],
    pieges: ["Confondre les débuts de DL (sin, cos, ln)", "Oublier le reste o(xⁿ)", "Inverser le critère de Riemann selon la borne", "Erreur de signe dans les cofacteurs", "Croire que AB = BA"],
    formules: ["DL usuels : eˣ, ln(1+x), sin, cos, (1+x)ᵅ", "Riemann : α>1 à l'infini, β<1 en 0", "det 2×2 = ad−bc ; inverse 2×2 = 1/(ad−bc)·[[d,−b],[−c,a]]"],
    methodes: ["DL : se ramener en 0, combiner les DL usuels, tronquer", "Intégrale : équivalent en la borne + comparaison Riemann", "Système : matrice augmentée puis Gauss"],
    prioritaires: ["x-m1", "x-m2", "x-m3", "x-m4"], fiches: ["m-dl", "m-int", "m-mat", "m-det", "m-sys"] },
  { subject: "meca",
    chapitres: ["Théorème de l'énergie cinétique", "Énergie mécanique & conservation", "Oscillateur harmonique", "Oscillateur amorti (3 régimes)", "Travail & puissance"],
    exos: ["Trouver une vitesse par le TEC", "Conservation de l'énergie sur un parcours", "Mettre un oscillateur en équation (forces ou énergie)", "Identifier le régime d'un oscillateur amorti", "Lire une courbe x(t) ou θ(t)"],
    pieges: ["Confondre travail et puissance", "Appliquer la conservation de Em malgré des frottements", "Confondre fréquence f et pulsation ω", "Mauvais signe du travail des frottements", "Mal identifier le régime"],
    formules: ["Ec = ½mv² ; Ep(ressort) = ½kx² ; Ep(pesanteur) = mgz", "TEC : ΔEc = ΣW ; TEM : ΔEm = W(non conservatif)", "ω₀ = √(k/m) ou √(g/L) ; T₀ = 2π/ω₀"],
    methodes: ["Choisir TEC/TEM/PFD selon ce qu'on cherche", "Méthode énergétique : Em puis dEm/dt", "Reconnaître le régime à l'allure de la courbe"],
    prioritaires: ["x-c1", "x-c2", "x-c3"], fiches: ["me-trav", "me-em", "me-osc", "me-amort", "me-pfd"] },
  { subject: "elec",
    chapitres: ["Thévenin/Norton (sources indépendantes)", "Thévenin avec sources liées", "Millman & méthode des nœuds", "Filtres RC & H(jω) (passe-haut/-bas)", "Diagrammes de Bode (gain & phase)", "AOP linéaire & trigger de Schmitt", "Valeur moyenne, valeur efficace, séries de Fourier"],
    exos: ["Calculer Rth/Eth et Rn/In, puis le courant dans la charge (diviseur de courant)", "Traiter une source liée avec un générateur de test", "Trouver le potentiel d'un nœud par Millman", "Donner H(jω), la nature et ωc d'un filtre RC", "Tracer le Bode asymptotique (gain + phase, pente, −3 dB)", "Calculer VH et VL d'un trigger de Schmitt", "Calculer ⟨s⟩, S et les coefficients de Fourier d'un créneau"],
    pieges: ["Éteindre une source liée comme une source indépendante", "Oublier le signe de In (orientation imposée A→B)", "Inverser le comportement de C en BF et HF", "Écrire V⁺ = V⁻ sans vérifier la contre-réaction", "Oublier le facteur R₁/(R₁+R₂) pour les seuils du trigger", "Confondre valeur moyenne et valeur efficace", "Rendre un résultat sous forme fractionnaire (interdit dans ce DS)"],
    formules: ["Rth = V_test / I_test (sources liées) ; Eth = UAB à vide ; io = Rn/(Rn+Rc)·In", "Millman : VA = (ΣVk/Rk + ΣIk) / Σ(1/Rk)", "Zc = 1/(jCω) ; ωc = 1/(RC) pour passe-bas simple", "VH = R₁/(R₁+R₂)·Vsat ; VL = −VH", "S = √[(1/T)∫s²dt] ; An = (8/nπ)·sin(nπ/2) pour le créneau"],
    methodes: ["Reconnaître le type : Thévenin/Norton, Millman, nœuds, AOP, filtre, Bode, Fourier", "Éteindre les sources INDÉPENDANTES pour Rth ; garder les sources liées", "Pour un filtre : schéma BF (C=ouvert) et HF (C=fil) → nature → H(jω) → ωc", "Pour l'AOP : identifier le régime (linéaire ou saturé) avant tout calcul"],
    prioritaires: ["x-e14", "x-e16", "x-e17", "x-e18", "x-e19"],
    fiches: ["e-lois", "e-div", "e-filtre", "e-bode", "e-aop", "e-methode"] },
];

/* ================== MÉTHODES DE PARTIEL ================== */

const METHODES_PARTIEL_GENERAL = [
  { titre: "Comment réviser efficacement",
    points: ["Réviser un peu chaque jour plutôt que tout la veille.", "Alterner lecture de fiches et exercices : on retient en pratiquant.", "Refaire les exercices ratés, pas seulement les réussis.", "Utiliser les flashcards en mode aléatoire pour s'auto-tester."] },
  { titre: "Comment lire un énoncé",
    points: ["Lire tout le sujet une fois avant de commencer.", "Souligner les données, les inconnues et ce qui est demandé.", "Repérer le type d'exercice (cf. Méthodes types).", "Vérifier le barème pour répartir son temps."] },
  { titre: "Comment gérer son temps",
    points: ["Calculer un budget de minutes par exercice selon le barème.", "Commencer par les questions qu'on sait faire.", "Ne pas s'acharner : passer et revenir plus tard.", "Garder 5 minutes pour relire."] },
  { titre: "Comment présenter une correction",
    points: ["Écrire la formule ou la loi littérale AVANT l'application numérique.", "Justifier chaque étape par une phrase courte.", "Encadrer ou souligner le résultat final avec son unité.", "Soigner la lisibilité : un correcteur pressé doit suivre."] },
  { titre: "Comment éviter les erreurs classiques",
    points: ["Vérifier les unités et l'homogénéité du résultat.", "Relire les pièges de la section Erreurs fréquentes avant le partiel.", "Contrôler les cas limites (vide, zéro, n=0).", "Se méfier des signes (travail des frottements, cofacteurs)."] },
  { titre: "Comment choisir la bonne méthode",
    points: ["Identifier le chapitre et le type d'exercice.", "Se demander ce qui est cherché (vitesse, équation, gain…).", "Choisir l'outil adapté (cf. Méthodes types par matière).", "En cas de doute, faire un petit exemple à la main."] },
];

const METHODES_PARTIEL_SUBJECT = [
  { subject: "info",
    conseils: ["Toujours structurer un main : init → remplissage → traitement → libération.", "Écrire l'algorithme en français avant de coder en C.", "Penser aux cas limites : structure vide, file vide, n = 0.", "Vérifier chaque malloc et libérer toute la mémoire allouée.", "Pour la compréhension de code, dérouler à la main avec un petit exemple.", "Indenter et commenter : un code lisible rapporte des points."] },
  { subject: "math",
    conseils: ["Poser clairement les hypothèses avant de calculer.", "Pour un DL : noter l'ordre demandé et garder le o(xⁿ).", "Pour une intégrale : justifier la convergence avant de calculer la valeur.", "Pour un système : vérifier det(A) ≠ 0 avant d'annoncer une solution unique.", "Détailler les étapes de calcul : le raisonnement est noté.", "Vérifier le résultat (ordre de grandeur, cas particulier)."] },
  { subject: "meca",
    conseils: ["Faire un schéma avec les forces et les axes.", "Choisir le bon théorème : TEC/TEM pour une vitesse, PFD pour une accélération.", "Écrire les expressions littérales avant l'application numérique.", "Vérifier l'homogénéité de chaque relation.", "Préciser le système étudié et le référentiel.", "Interpréter physiquement le résultat (sens, signe, ordre de grandeur)."] },
  { subject: "elec",
    conseils: ["Orienter les courants et les tensions sur le schéma.", "Citer la loi utilisée (Ohm, Kirchhoff, diviseur).", "En régime sinusoïdal, passer en impédances complexes.", "Pour un filtre : établir H(jω), puis f_c, puis le tracé.", "Pour un AOP : vérifier la contre-réaction avant d'écrire V⁺ = V⁻.", "Comparer la mesure de TP à la théorie et justifier les écarts."] },
];

/* ==================================================================
   RESSOURCES VIDÉO
   --------------------------------------------------------------------
   Les liens ci-dessous ouvrent une RECHERCHE YouTube sur le sujet
   (fonctionne tout de suite, et reste pertinent).
   Pour mettre une vidéo précise : remplace simplement le champ "url"
   par l'adresse de la vidéo, ex : "https://www.youtube.com/watch?v=XXXXXXXXXXX"
   ================================================================== */

function ytSearch(q) {
  return "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
}

const VIDEOS = [
  /* --- INFORMATIQUE --- */
  { id: "v-i1", subject: "info", chapter: "Pointeurs", type: "cours", niveau: "debutant", duree: 15,
    titre: "Les pointeurs en C — cours clair", url: ytSearch("pointeurs en C cours débutant"),
    desc: "Comprendre les adresses, & et *, et le passage par adresse." },
  { id: "v-i2", subject: "info", chapter: "Allocation", type: "cours", niveau: "normal", duree: 14,
    titre: "malloc, calloc, free expliqués", url: ytSearch("malloc free allocation dynamique C"),
    desc: "L'allocation dynamique, la différence pile / tas et les fuites mémoire." },
  { id: "v-i3", subject: "info", chapter: "Listes", type: "cours", niveau: "normal", duree: 20,
    titre: "Listes chaînées en C", url: ytSearch("listes chaînées C cours"),
    desc: "Maillons, ancre, parcours, insertion et suppression." },
  { id: "v-i4", subject: "info", chapter: "Piles & Files", type: "methode", niveau: "normal", duree: 16,
    titre: "Piles et files : FIFO / LIFO", url: ytSearch("piles files FIFO LIFO C"),
    desc: "Les deux conteneurs et leurs implémentations." },
  { id: "v-i5", subject: "info", chapter: "Récursivité", type: "cours", niveau: "debutant", duree: 12,
    titre: "La récursivité expliquée simplement", url: ytSearch("récursivité C cours débutant"),
    desc: "Cas de base, cas récursif et pile d'appels." },

  /* --- MATHÉMATIQUES --- */
  { id: "v-m1", subject: "math", chapter: "DL", type: "cours", niveau: "normal", duree: 22,
    titre: "Développements limités — cours complet", url: ytSearch("développements limités cours prépa"),
    desc: "Formule de Taylor-Young et DL usuels en 0." },
  { id: "v-m2", subject: "math", chapter: "DL", type: "exo", niveau: "normal", duree: 15,
    titre: "Calculer un DL — exercices corrigés", url: ytSearch("développement limité exercices corrigés"),
    desc: "Méthode pas à pas sur des produits et quotients de DL." },
  { id: "v-m3", subject: "math", chapter: "Équivalents", type: "methode", niveau: "normal", duree: 14,
    titre: "Équivalents et calcul de limites", url: ytSearch("équivalents limites développement limité"),
    desc: "Lever les formes indéterminées avec les équivalents et les DL." },
  { id: "v-m4", subject: "math", chapter: "Intégrales", type: "cours", niveau: "avance", duree: 25,
    titre: "Intégrales généralisées — convergence", url: ytSearch("intégrales généralisées convergence Riemann"),
    desc: "Critères de Riemann, comparaison et équivalence." },
  { id: "v-m5", subject: "math", chapter: "Matrices", type: "cours", niveau: "normal", duree: 18,
    titre: "Matrices et systèmes linéaires", url: ytSearch("matrices systèmes linéaires cours"),
    desc: "Opérations, produit et matrice inverse." },
  { id: "v-m6", subject: "math", chapter: "Systèmes", type: "methode", niveau: "normal", duree: 17,
    titre: "Méthode du pivot de Gauss", url: ytSearch("méthode pivot de Gauss système linéaire"),
    desc: "Échelonner et résoudre un système étape par étape." },
  { id: "v-m7", subject: "math", chapter: "Déterminants", type: "exo", niveau: "normal", duree: 13,
    titre: "Calcul de déterminants — exercices", url: ytSearch("calcul déterminant 3x3 exercices corrigés"),
    desc: "Sarrus, cofacteurs et lien avec l'inversibilité." },

  /* --- MÉCANIQUE --- */
  { id: "v-c1", subject: "meca", chapter: "Travail", type: "cours", niveau: "debutant", duree: 14,
    titre: "Travail et puissance d'une force", url: ytSearch("travail puissance force mécanique cours"),
    desc: "Définition du travail, signe et puissance." },
  { id: "v-c2", subject: "meca", chapter: "Énergie cinétique", type: "methode", niveau: "normal", duree: 16,
    titre: "Théorème de l'énergie cinétique (TEC)", url: ytSearch("théorème énergie cinétique TEC exercices"),
    desc: "Quand et comment appliquer le TEC." },
  { id: "v-c3", subject: "meca", chapter: "Énergie mécanique", type: "cours", niveau: "normal", duree: 18,
    titre: "Énergie potentielle et mécanique", url: ytSearch("énergie potentielle mécanique conservation"),
    desc: "Forces conservatives, TEM et conservation de l'énergie." },
  { id: "v-c4", subject: "meca", chapter: "PFD", type: "methode", niveau: "normal", duree: 20,
    titre: "Principe fondamental de la dynamique", url: ytSearch("principe fondamental dynamique PFD point matériel"),
    desc: "Bilan des forces, projection et équation du mouvement." },
  { id: "v-c5", subject: "meca", chapter: "Oscillateur", type: "cours", niveau: "normal", duree: 21,
    titre: "L'oscillateur harmonique", url: ytSearch("oscillateur harmonique masse ressort cours"),
    desc: "Équation, pulsation propre et solution sinusoïdale." },
  { id: "v-c6", subject: "meca", chapter: "Amortissement", type: "cours", niveau: "avance", duree: 19,
    titre: "Oscillations amorties et facteur de qualité", url: ytSearch("oscillations amorties régimes facteur de qualité"),
    desc: "Les trois régimes et le facteur de qualité Q." },
  { id: "v-c7", subject: "meca", chapter: "Oscillateur", type: "exo", niveau: "normal", duree: 15,
    titre: "Équations différentielles d'oscillateurs — exercices", url: ytSearch("équation différentielle oscillateur exercices corrigés"),
    desc: "Mise en équation par PFD et par méthode énergétique." },

  /* --- ÉLECTRONIQUE --- */
  { id: "v-e1", subject: "elec", chapter: "Lois", type: "cours", niveau: "debutant", duree: 13,
    titre: "Loi d'Ohm et lois de Kirchhoff", url: ytSearch("loi d'Ohm lois de Kirchhoff cours"),
    desc: "Lois des mailles et des nœuds, associations de résistances." },
  { id: "v-e2", subject: "elec", chapter: "Diviseur", type: "methode", niveau: "debutant", duree: 10,
    titre: "Le diviseur de tension", url: ytSearch("diviseur de tension pont diviseur cours"),
    desc: "La formule et ses conditions de validité." },
  { id: "v-e3", subject: "elec", chapter: "Sinusoïdal", type: "cours", niveau: "normal", duree: 18,
    titre: "Impédances complexes (R, L, C)", url: ytSearch("impédances complexes régime sinusoïdal cours"),
    desc: "Condensateur, bobine et impédances en régime sinusoïdal." },
  { id: "v-e4", subject: "elec", chapter: "AOP", type: "cours", niveau: "normal", duree: 20,
    titre: "L'amplificateur opérationnel idéal", url: ytSearch("amplificateur opérationnel AOP idéal cours"),
    desc: "Hypothèses de l'AOP idéal et régime linéaire." },
  { id: "v-e5", subject: "elec", chapter: "AOP", type: "exo", niveau: "normal", duree: 16,
    titre: "Montages inverseur et non-inverseur", url: ytSearch("montage inverseur non inverseur AOP exercices"),
    desc: "Calcul du gain des montages amplificateurs de base." },
  { id: "v-e6", subject: "elec", chapter: "AOP", type: "methode", niveau: "avance", duree: 15,
    titre: "Saturation et trigger de Schmitt", url: ytSearch("saturation AOP trigger de Schmitt hystérésis"),
    desc: "Régime saturé, comparateur à hystérésis et seuils de basculement." },
  { id: "v-e7", subject: "elec", chapter: "Filtres", type: "cours", niveau: "normal", duree: 22,
    titre: "Filtres passe-bas, passe-haut, passe-bande", url: ytSearch("filtres passe-bas passe-haut passe-bande cours"),
    desc: "Les types de filtres et leurs fonctions de transfert." },
  { id: "v-e8", subject: "elec", chapter: "Bode", type: "methode", niveau: "normal", duree: 19,
    titre: "Lire un diagramme de Bode", url: ytSearch("diagramme de Bode gain phase lecture"),
    desc: "Gain en dB, fréquence de coupure, ordre et phase." },
  { id: "v-e9", subject: "elec", chapter: "Filtres", type: "exo", niveau: "avance", duree: 17,
    titre: "Fréquence de coupure et gain en dB — exercices", url: ytSearch("fréquence de coupure gain dB filtre exercices corrigés"),
    desc: "Calculs sur les filtres RC et tracé de Bode." },
];

function videosOf(subjectId) {
  return VIDEOS.filter((v) => v.subject === subjectId);
}

/* ================== VUE — RESSOURCES VIDÉO ================== */

function VideoCard({ v }) {
  const sj = subjectById(v.subject);
  const typeLabel = { cours: "Cours", methode: "Méthode", exo: "Exercice corrigé" };
  const nivLabel = { debutant: "Débutant", normal: "Normal", avance: "Avancé" };
  const nivColor = { debutant: T.green, normal: T.amber, avance: T.coral };
  const url = v.url || "";
  const vkind = (!/^https?:\/\//.test(url) || /XXXX/i.test(url))
    ? "remplacer"
    : (url.indexOf("/results?") !== -1 || url.indexOf("search_query") !== -1)
      ? "recherche"
      : "directe";
  const vbadge = {
    directe: { c: T.green, txt: "▶ Vidéo directe" },
    recherche: { c: T.amber, txt: "🔎 Recherche YouTube" },
    remplacer: { c: T.coral, txt: "⚠ Lien à remplacer" },
  }[vkind];
  return (
    <div className="ece-card" style={{
      background: T.bg2, border: `1px solid ${T.line}`, borderLeft: `3px solid ${sj.color}`,
      borderRadius: 11, padding: "12px 14px", marginBottom: 9,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
        <div style={{ fontSize: 13.5, color: T.txt, fontWeight: 700, lineHeight: 1.35 }}>{v.titre}</div>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: T.faint, whiteSpace: "nowrap",
        }}>▶ {v.duree} min</span>
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: sj.color }}>
          {sj.name.toUpperCase()} · {v.chapter}
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.cyan,
          border: `1px solid ${T.cyan}55`, borderRadius: 5, padding: "2px 6px",
        }}>{typeLabel[v.type]}</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: nivColor[v.niveau],
          border: `1px solid ${nivColor[v.niveau]}55`, borderRadius: 5, padding: "2px 6px",
        }}>{nivLabel[v.niveau]}</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700,
          color: vbadge.c,
          border: `1px solid ${vbadge.c}66`, borderRadius: 5, padding: "2px 6px",
        }}>{vbadge.txt}</span>
      </div>
      <div style={{ fontSize: 12.3, color: T.dim, lineHeight: 1.5, marginTop: 6 }}>{v.desc}</div>
      <a href={url || undefined} target="_blank" rel="noopener noreferrer"
        style={{
          display: "inline-block", marginTop: 9, textDecoration: "none",
          background: vkind === "remplacer" ? T.bg4 : "#ec4030",
          color: vkind === "remplacer" ? T.dim : "#fff", borderRadius: 8,
          padding: "8px 14px", fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11.5, fontWeight: 700,
        }}>{vkind === "directe" ? "▶ Voir la vidéo" : vkind === "recherche" ? "🔎 Rechercher sur YouTube" : "⚠ Lien à compléter"}</a>
    </div>
  );
}

function VideosView({ go, initialSubject }) {
  const [subj, setSubj] = useState(initialSubject || "all");
  const [niv, setNiv] = useState("all");
  const [type, setType] = useState("all");
  const [duree, setDuree] = useState("all");
  const [chap, setChap] = useState("all");

  const chapitres = ["all", ...new Set(VIDEOS.filter((v) => subj === "all" || v.subject === subj).map((v) => v.chapter))];
  const dureeOk = (d) => duree === "all"
    || (duree === "courte" && d < 15)
    || (duree === "moyenne" && d >= 15 && d <= 22)
    || (duree === "longue" && d > 22);

  const filtered = VIDEOS.filter((v) =>
    (subj === "all" || v.subject === subj) &&
    (niv === "all" || v.niveau === niv) &&
    (type === "all" || v.type === type) &&
    (chap === "all" || v.chapter === chap) &&
    dureeOk(v.duree)
  );

  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Ressources vidéo</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 13 }}>
        Des vidéos YouTube pour réviser chaque notion. « Voir la vidéo » ouvre la ressource dans un nouvel onglet.
      </p>

      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 7 }}>
        <button onClick={() => { setSubj("all"); setChap("all"); }} style={chip(T.txt, subj === "all")}>Toutes matières</button>
        {SUBJECTS.map((s) => (
          <button key={s.id} onClick={() => { setSubj(s.id); setChap("all"); }} style={chip(s.color, subj === s.id)}>{s.name}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 7 }}>
        {chapitres.map((c) => (
          <button key={c} onClick={() => setChap(c)} style={chip(T.violet, chap === c)}>
            {c === "all" ? "Tous chapitres" : c}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 7 }}>
        {[["all", "Tous types"], ["cours", "Cours"], ["methode", "Méthode"], ["exo", "Exercice corrigé"]].map(([v, l]) => (
          <button key={v} onClick={() => setType(v)} style={chip(T.cyan, type === v)}>{l}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 7 }}>
        {[["all", "Tous niveaux"], ["debutant", "Débutant"], ["normal", "Normal"], ["avance", "Avancé"]].map(([v, l]) => (
          <button key={v} onClick={() => setNiv(v)} style={chip(T.amber, niv === v)}>{l}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 13 }}>
        {[["all", "Toute durée"], ["courte", "Courte < 15 min"], ["moyenne", "Moyenne"], ["longue", "Longue > 22 min"]].map(([v, l]) => (
          <button key={v} onClick={() => setDuree(v)} style={chip(T.green, duree === v)}>{l}</button>
        ))}
      </div>

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: T.faint, marginBottom: 8 }}>
        {filtered.length} vidéo{filtered.length !== 1 ? "s" : ""}
      </div>
      {filtered.length === 0 && (
        <div style={{ color: T.dim, fontSize: 13, padding: 14 }}>Aucune vidéo pour ces filtres.</div>
      )}
      {filtered.map((v) => <VideoCard key={v.id} v={v} />)}

      <Callout kind="info" title="Personnaliser les vidéos">
        Les liens ouvrent une recherche YouTube ciblée. Pour pointer une vidéo précise, il suffit de
        remplacer le champ « url » de la vidéo dans le code par l'adresse exacte (…/watch?v=…).
      </Callout>
    </div>
  );
}

/* ================== MÉTHODE ÉLECTRONIQUE ================== */

const METHODE_ELEC = [
  { id: "me-circuit", titre: "Analyser un circuit",
    intro: "Une démarche fiable avant de se lancer dans les calculs.",
    etapes: [
      "Orienter les courants et flécher les tensions sur le schéma.",
      "Repérer les mailles (boucles fermées) et les nœuds (points de jonction).",
      "Identifier les associations simples : résistances en série / parallèle.",
      "Choisir l'outil : loi d'Ohm, diviseur de tension, lois de Kirchhoff.",
      "Écrire les équations littérales, puis seulement faire l'application numérique.",
    ]},
  { id: "me-kirchhoff", titre: "Appliquer les lois des mailles et des nœuds",
    intro: "Les deux lois de Kirchhoff, base de toute analyse de circuit.",
    etapes: [
      "Loi des nœuds : la somme des courants entrants = somme des courants sortants.",
      "Loi des mailles : la somme algébrique des tensions sur une boucle fermée est nulle.",
      "Choisir un sens de parcours pour chaque maille et s'y tenir.",
      "Compter une tension positive si on la parcourt du − vers le +, négative sinon.",
      "Résoudre le système d'équations obtenu.",
    ]},
  { id: "me-filtre", titre: "Reconnaître un filtre",
    intro: "Identifier le type de filtre à partir du circuit ou de H(jω).",
    etapes: [
      "Étudier le comportement quand ω → 0 (basses fréquences).",
      "Étudier le comportement quand ω → ∞ (hautes fréquences).",
      "Basses qui passent, hautes coupées → passe-bas. L'inverse → passe-haut.",
      "Une bande au milieu qui passe → passe-bande. Une bande bloquée → coupe-bande.",
      "Confirmer avec la fonction de transfert : un jω au numérateur coupe les basses fréquences.",
    ]},
  { id: "me-bode", titre: "Lire un diagramme de Bode",
    intro: "Décoder les deux courbes gain et phase.",
    etapes: [
      "Sur la courbe du GAIN : repérer les zones plates (basses et hautes fréquences).",
      "Identifier le type de filtre d'après l'allure (plat puis chute, etc.).",
      "Mesurer la pente après la coupure : −20 dB/décade par ordre du filtre.",
      "Sur la courbe de PHASE : lire le déphasage (0°, ±45° à la coupure, ±90°).",
      "Ne jamais lire la fréquence de coupure sur la courbe de phase.",
    ]},
  { id: "me-fc", titre: "Trouver la fréquence de coupure",
    intro: "La fréquence qui sépare la bande passante de la bande coupée.",
    etapes: [
      "Repérer le gain dans la bande passante (souvent 0 dB).",
      "Descendre de 3 dB : c'est le seuil de coupure (|H| divisé par √2).",
      "Lire la fréquence correspondante sur la courbe du gain.",
      "Par le calcul : poser RCω_c = 1, d'où ω_c = 1/(RC).",
      "Convertir : f_c = ω_c / (2π).",
    ]},
  { id: "me-aop", titre: "AOP : régime linéaire ou saturé ?",
    intro: "La question à se poser AVANT tout calcul sur un montage à AOP.",
    etapes: [
      "Repérer où arrive la contre-réaction (le fil qui revient sur une entrée).",
      "Contre-réaction sur l'entrée − → régime LINÉAIRE : on peut écrire V⁺ = V⁻.",
      "Contre-réaction sur l'entrée + (ou aucune) → régime SATURÉ : Vs = +Vsat ou −Vsat.",
      "En linéaire : poser i⁺ = i⁻ = 0, puis loi des nœuds et diviseur de tension.",
      "Même en linéaire, si le calcul dépasse ±Vsat, la sortie est écrêtée (saturation).",
    ]},
];

function MethodeElecView({ go }) {
  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Méthode électronique</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 14 }}>
        Les démarches pas à pas pour aborder n'importe quel exercice d'électronique.
      </p>
      {METHODE_ELEC.map((m, i) => (
        <div key={m.id} style={panelSt()}>
          <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 3 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: T.green, fontWeight: 800 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13.8, fontWeight: 700, color: T.txt }}>{m.titre}</div>
          </div>
          <p style={{ fontSize: 12, color: T.dim, lineHeight: 1.5, margin: "0 0 8px" }}>{m.intro}</p>
          <ol style={{ margin: 0, paddingLeft: 0, listStyle: "none" }}>
            {m.etapes.map((e, j) => (
              <li key={j} style={{ display: "flex", gap: 9, margin: "6px 0", alignItems: "flex-start" }}>
                <span style={{
                  width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                  background: `${T.green}1e`, border: `1px solid ${T.green}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 800, color: T.green,
                }}>{j + 1}</span>
                <span style={{ fontSize: 12.8, color: T.txt, lineHeight: 1.55 }}>{e}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => go({ view: "subject", id: "elec" })} style={primBtn(T.green)}>Fiches d'électronique</button>
        <button onClick={() => go({ view: "entrainementelec" })} style={ghostBtn()}>Entraînement électronique</button>
      </div>
    </div>
  );
}

/* ================== ENTRAÎNEMENT ÉLECTRONIQUE ================== */

function EntrainementElecView({ go }) {
  const exos = EXOS.filter((e) => e.subject === "elec");
  const sujets = (typeof TRAINING !== "undefined" ? TRAINING : SUJETS).filter((s) => s.subject === "elec");
  const vids = VIDEOS.filter((v) => v.subject === "elec");

  const cat = (tags) => {
    if (tags.includes("cours") || tags.includes("lois")) return "Exercices de cours";
    if (tags.includes("contrôle")) return "Type contrôle";
    if (tags.includes("lecture de courbe") || tags.includes("méthode TP") || tags.includes("Bode")) return "Lecture de courbe & Bode";
    if (tags.includes("AOP") || tags.includes("filtres") || tags.includes("Schmitt")) return "AOP & filtres";
    return "Exercices de TD";
  };
  const ordre = ["Exercices de cours", "Exercices de TD", "Type contrôle", "Lecture de courbe & Bode", "AOP & filtres"];
  const groupes = ordre
    .map((g) => ({ g, items: exos.filter((e) => cat(e.tags) === g) }))
    .filter((x) => x.items.length);

  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Entraînement électronique</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 13 }}>
        De quoi s'entraîner en électronique, à partir des cours et TD.
      </p>

      <Callout kind="tip" title="3 annales d'électronique disponibles">
        Trois vrais DS d'électronique S2 — DS1 et DS2 2021-2022, et DS2 2020-2021 — sont
        désormais intégrés avec correction retranscrite des copies manuscrites. Tu les trouves dans la section Annales. Les exercices ci-dessous sont, en plus,
        des entraînements ciblés sur les chapitres de ces DS.
      </Callout>
      <button onClick={() => go({ view: "training", subject: "elec" })}
        style={{ ...primBtn(T.green), marginBottom: 13 }}>
        ◈ Ouvrir les annales d'électronique
      </button>

      {groupes.map(({ g, items }) => (
        <div key={g} style={{ marginBottom: 13 }}>
          <SectionLabel>{g} · {items.length}</SectionLabel>
          {items.map((e) => (
            <div key={e.id} onClick={() => go({ view: "exos" })}
              style={{
                background: T.bg2, border: `1px solid ${T.line}`, borderLeft: `3px solid ${T.green}`,
                borderRadius: 10, padding: "10px 13px", marginBottom: 6, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 9,
              }}>
              <span style={{ color: T.green, fontSize: 13 }}>✎</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12.8, color: T.txt, fontWeight: 600 }}>{e.title}</div>
                <div style={{ fontSize: 10.5, color: T.faint, fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>
                  {e.difficulty} · {e.temps}
                </div>
              </div>
              <span style={{ color: T.faint, fontSize: 14 }}>›</span>
            </div>
          ))}
        </div>
      ))}

      {sujets.length > 0 && (
        <div style={{ marginBottom: 13 }}>
          <SectionLabel>Sujets d'entraînement inédits · {sujets.length}</SectionLabel>
          <p style={{ fontSize: 11.5, color: T.dim, lineHeight: 1.5, margin: "0 0 8px" }}>
            Des sujets construits pour s'entraîner — ce ne sont pas de vrais partiels.
          </p>
          <button onClick={() => go({ view: "training", subject: "elec" })} style={primBtn(T.green)}>
            Ouvrir les sujets d'entraînement
          </button>
        </div>
      )}

      <SectionLabel>Pour aller plus loin</SectionLabel>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => go({ view: "methodeelec" })} style={ghostBtn()}>◎ Méthode électronique</button>
        <button onClick={() => go({ view: "subject", id: "elec" })} style={ghostBtn()}>◆ Fiches d'électronique</button>
        {vids.length > 0 && (
          <button onClick={() => go({ view: "videos", subject: "elec" })} style={ghostBtn()}>▶ Vidéos ({vids.length})</button>
        )}
      </div>
    </div>
  );
}

/* ==================================================================
   MOTEUR DE RENDU MATHÉMATIQUE — autonome, sans dépendance
   --------------------------------------------------------------------
   Rend un sous-ensemble de LaTeX directement en HTML/CSS : fractions,
   racines, sommes, intégrales, indices, exposants, matrices, lettres
   grecques. Fonctionne partout (aperçu et projet Vite), sans CDN.

   Composants exposés :
     <Formula tex="..." />        formule inline
     <FormulaBlock b={...} />     bloc de fiche { t:"formula", tex, note }
     <MathText>texte $...$</MathText>   texte mixte avec math inline
   ================================================================== */

const TEX_SYM = {
  alpha: "\u03b1", beta: "\u03b2", gamma: "\u03b3", delta: "\u03b4", Delta: "\u0394",
  epsilon: "\u03b5", varepsilon: "\u03b5", zeta: "\u03b6", eta: "\u03b7", theta: "\u03b8",
  iota: "\u03b9", kappa: "\u03ba", lambda: "\u03bb", Lambda: "\u039b", mu: "\u03bc",
  nu: "\u03bd", xi: "\u03be", pi: "\u03c0", Pi: "\u03a0", rho: "\u03c1", sigma: "\u03c3",
  Sigma: "\u03a3", tau: "\u03c4", phi: "\u03c6", varphi: "\u03c6", Phi: "\u03a6",
  chi: "\u03c7", psi: "\u03c8", Psi: "\u03a8", omega: "\u03c9", Omega: "\u03a9",
  cdot: "\u00b7", cdots: "\u22ef", ldots: "\u2026", dots: "\u2026", times: "\u00d7",
  div: "\u00f7", pm: "\u00b1", mp: "\u2213", ast: "\u2217", star: "\u22c6",
  le: "\u2264", leq: "\u2264", ge: "\u2265", geq: "\u2265", ne: "\u2260", neq: "\u2260",
  approx: "\u2248", sim: "\u223c", simeq: "\u2243", equiv: "\u2261", propto: "\u221d",
  infty: "\u221e", partial: "\u2202", nabla: "\u2207", forall: "\u2200", exists: "\u2203",
  in: "\u2208", notin: "\u2209", subset: "\u2282", cup: "\u222a", cap: "\u2229",
  emptyset: "\u2205", to: "\u2192", rightarrow: "\u2192", longrightarrow: "\u27f6",
  Rightarrow: "\u21d2", implies: "\u27f9", iff: "\u27fa", Leftrightarrow: "\u21d4",
  leftarrow: "\u2190", mapsto: "\u21a6", langle: "\u27e8", rangle: "\u27e9",
  prime: "\u2032", circ: "\u2218", bullet: "\u2219", oplus: "\u2295", otimes: "\u2297",
  perp: "\u22a5", parallel: "\u2225", angle: "\u2220", degree: "\u00b0",
};
const TEX_BIGOP = { sum: "\u2211", prod: "\u220f", int: "\u222b", oint: "\u222e", bigcup: "\u22c3", bigcap: "\u22c2", lim: "lim" };
const TEX_FUNC = new Set(["log", "ln", "exp", "sin", "cos", "tan", "cot", "sec", "csc", "arg", "det", "max", "min", "lim", "sinh", "cosh", "tanh", "gcd", "dim", "ker", "deg"]);
const TEX_ACCENT = { dot: "\u0307", ddot: "\u0308", hat: "\u0302", bar: "\u0304", vec: "\u20d7", tilde: "\u0303", check: "\u030c" };

function texTokenize(src) {
  const t = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === "\\") {
      let j = i + 1;
      if (j < src.length && /[A-Za-z]/.test(src[j])) {
        let name = "";
        while (j < src.length && /[A-Za-z]/.test(src[j])) { name += src[j]; j++; }
        if ((name === "text" || name === "operatorname" || name === "mathrm") && src[j] === "{") {
          let depth = 1, k = j + 1, raw = "";
          while (k < src.length && depth > 0) {
            if (src[k] === "{") depth++;
            else if (src[k] === "}") { depth--; if (depth === 0) break; }
            raw += src[k]; k++;
          }
          t.push({ t: "text", v: raw });
          i = k + 1;
        } else { t.push({ t: "cmd", v: name }); i = j; }
      } else { t.push({ t: "cmd", v: src[j] }); i = j + 1; }
    } else if (c === "{") { t.push({ t: "open" }); i++; }
    else if (c === "}") { t.push({ t: "close" }); i++; }
    else if (c === "^") { t.push({ t: "sup" }); i++; }
    else if (c === "_") { t.push({ t: "sub" }); i++; }
    else if (c === "&") { t.push({ t: "amp" }); i++; }
    else if (c === " ") { i++; }
    else { t.push({ t: "ch", v: c }); i++; }
  }
  return t;
}

function texParse(tokens) {
  let i = 0;

  function scriptArg() {
    if (i >= tokens.length) return [];
    const tk = tokens[i];
    if (tk.t === "open") {
      i++;
      const g = seq(["close"]);
      if (tokens[i] && tokens[i].t === "close") i++;
      return g;
    }
    const a = atom();
    return a ? [a] : [];
  }

  function withScripts(node) {
    while (i < tokens.length && (tokens[i].t === "sup" || tokens[i].t === "sub")) {
      const w = tokens[i].t; i++;
      const arg = scriptArg();
      if (w === "sup") node.sup = arg; else node.sub = arg;
    }
    return node;
  }

  function matrix() {
    let env = "";
    if (tokens[i] && tokens[i].t === "open") {
      i++;
      while (i < tokens.length && tokens[i].t !== "close") { if (tokens[i].t === "ch") env += tokens[i].v; i++; }
      if (tokens[i] && tokens[i].t === "close") i++;
    }
    const rows = [[]];
    let cell = [];
    while (i < tokens.length) {
      const tk = tokens[i];
      if (tk.t === "cmd" && tk.v === "end") {
        i++;
        if (tokens[i] && tokens[i].t === "open") {
          while (i < tokens.length && tokens[i].t !== "close") i++;
          if (tokens[i]) i++;
        }
        break;
      }
      if (tk.t === "amp") { rows[rows.length - 1].push(cell); cell = []; i++; continue; }
      if (tk.t === "cmd" && tk.v === "\\") { rows[rows.length - 1].push(cell); cell = []; rows.push([]); i++; continue; }
      const before = i;
      const a = withScripts(atom() || { k: "grp", nodes: [] });
      if (a && a.k !== "skip") cell.push(a);
      if (i === before) i++;
    }
    rows[rows.length - 1].push(cell);
    const clean = rows.filter((r) => !(r.length === 1 && r[0].length === 0));
    return { k: "mat", env, rows: clean };
  }

  function atom() {
    if (i >= tokens.length) return null;
    const tk = tokens[i];
    if (tk.t === "close") { i++; return null; }
    if (tk.t === "amp") { i++; return null; }
    if (tk.t === "sup" || tk.t === "sub") { i++; return { k: "grp", nodes: [] }; }
    if (tk.t === "open") {
      i++;
      const s = seq(["close"]);
      if (tokens[i] && tokens[i].t === "close") i++;
      return { k: "grp", nodes: s };
    }
    if (tk.t === "text") { i++; return { k: "text", v: tk.v }; }
    if (tk.t === "ch") { i++; return { k: "ch", v: tk.v }; }
    if (tk.t === "cmd") {
      const name = tk.v; i++;
      if (name === "frac" || name === "dfrac" || name === "tfrac")
        return { k: "frac", num: scriptArg(), den: scriptArg() };
      if (name === "sqrt") return { k: "sqrt", body: scriptArg() };
      if (name in TEX_ACCENT) return { k: "accent", acc: TEX_ACCENT[name], body: scriptArg() };
      if (name === "left" || name === "right" || name === "big" || name === "Big" ||
          name === "bigg" || name === "Bigg" || name === "biggl" || name === "biggr") {
        if (i < tokens.length && (tokens[i].t === "ch" || tokens[i].t === "cmd")) {
          const d = tokens[i]; i++;
          if (d.t === "ch" && d.v === ".") return { k: "skip" };
          const ch = d.t === "ch" ? d.v : (TEX_SYM[d.v] || "");
          return { k: "delim", v: ch };
        }
        return { k: "skip" };
      }
      if (name === "begin") return matrix();
      if (name === "end") {
        if (tokens[i] && tokens[i].t === "open") {
          while (i < tokens.length && tokens[i].t !== "close") i++;
          if (tokens[i]) i++;
        }
        return { k: "skip" };
      }
      if (name === ",") return { k: "sp", w: 0.17 };
      if (name === ";") return { k: "sp", w: 0.27 };
      if (name === ":") return { k: "sp", w: 0.22 };
      if (name === "!") return { k: "sp", w: -0.17 };
      if (name === " ") return { k: "sp", w: 0.26 };
      if (name === "quad") return { k: "sp", w: 1.0 };
      if (name === "qquad") return { k: "sp", w: 2.0 };
      if (name === "\\") return { k: "br" };
      if (name in TEX_BIGOP) return { k: "op", v: TEX_BIGOP[name], stack: name !== "int" && name !== "oint" };
      if (TEX_FUNC.has(name)) return { k: "func", v: name };
      if (name in TEX_SYM) return { k: "sym", v: TEX_SYM[name] };
      return { k: "sym", v: name };
    }
    i++;
    return null;
  }

  function seq(stops) {
    const out = [];
    while (i < tokens.length) {
      if (stops.indexOf(tokens[i].t) !== -1) break;
      const before = i;
      const a = withScripts(atom() || { k: "skip" });
      if (a && a.k !== "skip") out.push(a);
      if (i === before) i++;
    }
    return out;
  }

  return seq([]);
}

/* ---------- rendu ---------- */

function texMinus(s) { return String(s).replace(/-/g, "\u2212"); }

function TexScript({ nodes }) {
  return <span>{renderTexNodes(nodes)}</span>;
}

function attachTexScripts(base, node, key) {
  const hasSup = node.sup && node.sup.length;
  const hasSub = node.sub && node.sub.length;
  if (!hasSup && !hasSub) return <span key={key}>{base}</span>;
  if (hasSup && hasSub) {
    return (
      <span key={key} style={{ whiteSpace: "nowrap" }}>
        {base}
        <span style={{ display: "inline-flex", flexDirection: "column", fontSize: "0.68em", lineHeight: 1.08, verticalAlign: "-0.25em", marginLeft: "0.06em", textAlign: "left" }}>
          <span><TexScript nodes={node.sup} /></span>
          <span><TexScript nodes={node.sub} /></span>
        </span>
      </span>
    );
  }
  if (hasSup)
    return (
      <span key={key} style={{ whiteSpace: "nowrap" }}>
        {base}
        <span style={{ fontSize: "0.7em", verticalAlign: "0.62em", marginLeft: "0.04em" }}><TexScript nodes={node.sup} /></span>
      </span>
    );
  return (
    <span key={key} style={{ whiteSpace: "nowrap" }}>
      {base}
      <span style={{ fontSize: "0.7em", verticalAlign: "-0.32em", marginLeft: "0.04em" }}><TexScript nodes={node.sub} /></span>
    </span>
  );
}

function renderTexNode(node, key) {
  if (node.k === "skip" || node.k === "br") return null;

  if (node.k === "sp")
    return <span key={key} style={{ display: "inline-block", width: node.w + "em" }} />;

  if (node.k === "ch") {
    const v = node.v;
    const isLetter = /[A-Za-z]/.test(v);
    const base = (
      <span style={{ fontStyle: isLetter ? "italic" : "normal" }}>
        {v === "-" ? "\u2212" : v}
      </span>
    );
    return attachTexScripts(base, node, key);
  }

  if (node.k === "sym") {
    const base = <span>{texMinus(node.v)}</span>;
    return attachTexScripts(base, node, key);
  }

  if (node.k === "text") {
    const base = <span style={{ fontStyle: "normal" }}>{node.v}</span>;
    return attachTexScripts(base, node, key);
  }

  if (node.k === "func") {
    const base = <span style={{ fontStyle: "normal", marginRight: "0.12em" }}>{node.v}</span>;
    return attachTexScripts(base, node, key);
  }

  if (node.k === "delim") {
    const base = <span style={{ fontSize: "1.05em" }}>{node.v}</span>;
    return attachTexScripts(base, node, key);
  }

  if (node.k === "grp") {
    const base = <span>{renderTexNodes(node.nodes)}</span>;
    return attachTexScripts(base, node, key);
  }

  if (node.k === "accent") {
    const b = node.body;
    let inner;
    if (b.length === 1 && b[0].k === "ch") {
      inner = <span style={{ fontStyle: /[A-Za-z]/.test(b[0].v) ? "italic" : "normal" }}>{b[0].v + node.acc}</span>;
    } else {
      inner = <span>{renderTexNodes(b)}{node.acc}</span>;
    }
    return attachTexScripts(<span key={key}>{inner}</span>, node, key);
  }

  if (node.k === "frac") {
    const base = (
      <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", margin: "0 0.18em", fontSize: "0.97em" }}>
        <span style={{ padding: "0 0.35em 0.06em" }}>{renderTexNodes(node.num)}</span>
        <span style={{ padding: "0.08em 0.35em 0", borderTop: "1.3px solid currentColor", width: "100%", textAlign: "center", boxSizing: "border-box" }}>
          {renderTexNodes(node.den)}
        </span>
      </span>
    );
    return attachTexScripts(base, node, key);
  }

  if (node.k === "sqrt") {
    const base = (
      <span style={{ display: "inline-flex", alignItems: "flex-start", whiteSpace: "nowrap" }}>
        <span style={{ fontSize: "1.15em", lineHeight: 1, marginRight: "0.04em" }}>{"\u221a"}</span>
        <span style={{ borderTop: "1.3px solid currentColor", padding: "0.12em 0.18em 0" }}>
          {renderTexNodes(node.body)}
        </span>
      </span>
    );
    return attachTexScripts(base, node, key);
  }

  if (node.k === "op") {
    const glyph = <span style={{ fontSize: "1.5em", lineHeight: 0.85 }}>{node.v}</span>;
    if (node.stack && (node.sup || node.sub)) {
      return (
        <span key={key} style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", verticalAlign: "middle", margin: "0 0.16em" }}>
          <span style={{ fontSize: "0.6em", lineHeight: 1 }}>{node.sup ? <TexScript nodes={node.sup} /> : ""}</span>
          {glyph}
          <span style={{ fontSize: "0.6em", lineHeight: 1 }}>{node.sub ? <TexScript nodes={node.sub} /> : ""}</span>
        </span>
      );
    }
    return attachTexScripts(<span key={key} style={{ margin: "0 0.05em" }}>{glyph}</span>, node, key);
  }

  if (node.k === "mat") {
    const isCases = node.env === "cases";
    const open = isCases ? "{" : node.env === "bmatrix" ? "[" : node.env === "vmatrix" ? "|" : node.env === "Bmatrix" ? "{" : "(";
    const close = isCases ? "" : node.env === "bmatrix" ? "]" : node.env === "vmatrix" ? "|" : node.env === "Bmatrix" ? "}" : ")";
    const showParens = node.env !== "matrix";
    const parenSize = Math.max(1.3, node.rows.length * 1.15);
    const cols = (node.rows[0] && node.rows[0].length) || 1;
    return (
      <span key={key} style={{ display: "inline-flex", alignItems: "center", verticalAlign: "middle", margin: "0 0.1em" }}>
        {showParens && <span style={{ fontSize: parenSize + "em", lineHeight: 0.9 }}>{open}</span>}
        <span style={{ display: "inline-grid", gridTemplateColumns: `repeat(${cols}, auto)`, gap: isCases ? "0.32em 0.7em" : "0.15em 0.7em", padding: "0 0.18em" }}>
          {node.rows.map((row, ri) =>
            row.map((cell, ci) => (
              <span key={ri + "-" + ci} style={{ textAlign: isCases ? "left" : "center" }}>{renderTexNodes(cell)}</span>
            ))
          )}
        </span>
        {showParens && close && <span style={{ fontSize: parenSize + "em", lineHeight: 0.9 }}>{close}</span>}
      </span>
    );
  }

  return null;
}

function renderTexNodes(nodes) {
  if (!nodes) return null;
  return nodes.map((n, i) => renderTexNode(n, i));
}

function renderTeX(tex) {
  try {
    return renderTexNodes(texParse(texTokenize(String(tex))));
  } catch (e) {
    return <span>{String(tex)}</span>;
  }
}

/* ---------- composants exposés ---------- */

function Formula({ tex }) {
  return (
    <span style={{
      fontFamily: "'Cambria Math','STIX Two Math','Latin Modern Math','Times New Roman',serif",
      color: T.txt, whiteSpace: "nowrap",
    }}>
      {renderTeX(tex)}
    </span>
  );
}
const MathInline = Formula;

function MathBlock({ tex }) {
  return (
    <div style={{
      fontFamily: "'Cambria Math','STIX Two Math','Latin Modern Math','Times New Roman',serif",
      color: T.txt, textAlign: "center", fontSize: "1.16em", lineHeight: 1.5,
      padding: "6px 0", overflowX: "auto", overflowY: "hidden",
    }}>
      {renderTeX(tex)}
    </div>
  );
}

/* Bloc de fiche : { t:"formula", tex: "..." | ["...","..."], note?: "..." } */
function FormulaBlock({ b, color }) {
  const lines = Array.isArray(b.tex) ? b.tex : [b.tex];
  const c = color || T.cyan;
  return (
    <div style={{
      background: T.bg3, border: `1px solid ${T.line}`, borderLeft: `3px solid ${c}`,
      borderRadius: 10, padding: "13px 14px", margin: "10px 0",
    }}>
      {lines.map((tx, i) => <MathBlock key={i} tex={tx} />)}
      {b.note && (
        <p style={{
          fontSize: 12.3, color: T.dim, lineHeight: 1.55, margin: "8px 0 0",
          textAlign: "center", fontStyle: "italic",
        }}>{b.note}</p>
      )}
    </div>
  );
}

/* Texte mixte : les segments entre $...$ deviennent des formules inline. */
function MathText({ children }) {
  if (typeof children !== "string" || children.indexOf("$") === -1) return children;
  const parts = children.split(/(\$[^$]+\$)/g);
  return parts.map((p, i) =>
    p.length > 1 && p[0] === "$" && p[p.length - 1] === "$"
      ? <Formula key={i} tex={p.slice(1, -1)} />
      : <span key={i}>{p}</span>
  );
}

/* ==================================================================
   SCHÉMAS ÉLECTRONIQUE — SVG pédagogiques, autonomes, thème sombre
   --------------------------------------------------------------------
   Bloc de fiche : { t:"schema", name:"...", legend:"..." }
   Composants réutilisables exposés via le registre SCHEMAS.
   ================================================================== */

/* ---------- primitives ---------- */
function SWire({ d }) {
  return <polyline points={d} fill="none" stroke={T.dim} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />;
}
function SLbl({ x, y, t, c, anchor, size }) {
  return (
    <text x={x} y={y} fill={c || T.dim} fontSize={size || 10.5}
      fontFamily="'JetBrains Mono', monospace" textAnchor={anchor || "middle"} fontWeight="700">{t}</text>
  );
}
function SDot({ x, y }) { return <circle cx={x} cy={y} r="3.3" fill={T.txt} />; }
function SRes({ x, y, vert }) {
  const w = vert ? 15 : 38, h = vert ? 38 : 15;
  return <rect x={x - w / 2} y={y - h / 2} width={w} height={h} fill={T.bg4} stroke={T.txt} strokeWidth="1.8" rx="2.5" />;
}
function SCap({ x, y, vert }) {
  if (vert) return (
    <g stroke={T.txt} strokeWidth="2.6" strokeLinecap="round">
      <line x1={x - 12} y1={y - 3.5} x2={x + 12} y2={y - 3.5} />
      <line x1={x - 12} y1={y + 3.5} x2={x + 12} y2={y + 3.5} />
    </g>
  );
  return (
    <g stroke={T.txt} strokeWidth="2.6" strokeLinecap="round">
      <line x1={x - 3.5} y1={y - 12} x2={x - 3.5} y2={y + 12} />
      <line x1={x + 3.5} y1={y - 12} x2={x + 3.5} y2={y + 12} />
    </g>
  );
}
function SGnd({ x, y }) {
  return (
    <g stroke={T.dim} strokeWidth="1.8" strokeLinecap="round">
      <line x1={x} y1={y} x2={x} y2={y + 7} />
      <line x1={x - 9} y1={y + 7} x2={x + 9} y2={y + 7} />
      <line x1={x - 5.5} y1={y + 11} x2={x + 5.5} y2={y + 11} />
      <line x1={x - 2} y1={y + 15} x2={x + 2} y2={y + 15} />
    </g>
  );
}
function SAmp({ x, y }) {
  return (
    <g>
      <polygon points={`${x},${y - 30} ${x},${y + 30} ${x + 54},${y}`}
        fill={T.bg4} stroke={T.txt} strokeWidth="1.9" strokeLinejoin="round" />
      <SLbl x={x + 12} y={y - 10} t="+" c={T.green} size={14} />
      <SLbl x={x + 12} y={y + 18} t="−" c={T.coral} size={14} />
    </g>
  );
}
function STerm({ x, y, c }) {
  return <circle cx={x} cy={y} r="3.4" fill="none" stroke={c || T.cyan} strokeWidth="1.9" />;
}
function SGen({ x, y }) {
  return (
    <g>
      <circle cx={x} cy={y} r="16" fill={T.bg4} stroke={T.txt} strokeWidth="1.8" />
      <SLbl x={x} y={y - 2} t="+" c={T.green} size={12} />
      <line x1={x - 6} y1={y + 7} x2={x + 6} y2={y + 7} stroke={T.coral} strokeWidth="2" />
    </g>
  );
}
function SArrow({ x, y, dir, c }) {
  const col = c || T.amber;
  let pts;
  if (dir === "right") pts = `${x - 5},${y - 4.5} ${x + 5},${y} ${x - 5},${y + 4.5}`;
  else if (dir === "left") pts = `${x + 5},${y - 4.5} ${x - 5},${y} ${x + 5},${y + 4.5}`;
  else if (dir === "down") pts = `${x - 4.5},${y - 5} ${x},${y + 5} ${x + 4.5},${y - 5}`;
  else pts = `${x - 4.5},${y + 5} ${x},${y - 5} ${x + 4.5},${y + 5}`;
  return <polygon points={pts} fill={col} />;
}
function SVGBox({ vb, children }) {
  return (
    <svg viewBox={vb} width="100%" style={{ maxWidth: 350, display: "block", margin: "3px auto" }}>
      {children}
    </svg>
  );
}

/* ---------- schémas de base ---------- */
function OhmSchema() {
  return (
    <SVGBox vb="0 0 300 175">
      <SWire d="48,38 252,38" />
      <SWire d="48,38 48,76" /><SWire d="48,112 48,150" />
      <SWire d="252,38 252,73" /><SWire d="252,113 252,150" />
      <SWire d="48,150 252,150" />
      <SGen x={48} y={94} />
      <SRes x={252} y={93} vert />
      <SArrow x={150} y={38} dir="right" />
      <SLbl x={150} y={29} t="I" c={T.amber} />
      <SLbl x={20} y={97} t="E" c={T.txt} anchor="start" />
      <SLbl x={232} y={97} t="R" c={T.txt} anchor="end" />
      <g stroke={T.cyan} strokeWidth="1.5">
        <line x1={278} y1={76} x2={278} y2={110} />
      </g>
      <SArrow x={278} y={77} dir="up" c={T.cyan} />
      <SArrow x={278} y={109} dir="down" c={T.cyan} />
      <SLbl x={286} y={97} t="U" c={T.cyan} anchor="start" />
      <SLbl x={150} y={167} t="U = R · I" c={T.dim} size={9.5} />
    </SVGBox>
  );
}
function MaillesSchema() {
  return (
    <SVGBox vb="0 0 300 175">
      <SWire d="46,40 254,40" />
      <SWire d="46,40 46,78" /><SWire d="46,114 46,150" />
      <SWire d="254,40 254,150" />
      <SWire d="46,150 254,150" />
      <SGen x={46} y={96} />
      <SRes x={150} y={40} />
      <SRes x={254} y={95} vert />
      <SArrow x={100} y={40} dir="right" />
      <SLbl x={100} y={31} t="I" c={T.amber} />
      <SLbl x={150} y={26} t="R₁" c={T.txt} />
      <SLbl x={234} y={99} t="R₂" c={T.txt} anchor="end" />
      <SLbl x={20} y={99} t="E" c={T.txt} anchor="start" />
      <SLbl x={150} y={167} t="E = U(R₁) + U(R₂)  ·  loi des mailles" c={T.dim} size={9} />
    </SVGBox>
  );
}
function NoeudsSchema() {
  return (
    <SVGBox vb="0 0 300 165">
      <SWire d="40,80 150,80" />
      <SWire d="150,80 250,40" />
      <SWire d="150,80 250,120" />
      <SDot x={150} y={80} />
      <SArrow x={95} y={80} dir="right" />
      <SLbl x={95} y={71} t="I" c={T.amber} />
      <SArrow x={205} y={60} dir="right" c={T.green} />
      <SLbl x={205} y={48} t="I₁" c={T.green} />
      <SArrow x={205} y={100} dir="right" c={T.green} />
      <SLbl x={205} y={118} t="I₂" c={T.green} />
      <SLbl x={150} y={103} t="nœud" c={T.dim} size={9} />
      <SLbl x={150} y={150} t="I = I₁ + I₂  ·  loi des nœuds" c={T.dim} size={9.5} />
    </SVGBox>
  );
}
function CircuitDividerSchema() {
  return (
    <SVGBox vb="0 0 300 180">
      <SWire d="58,42 58,72" /><SWire d="58,92 58,118" /><SWire d="58,138 58,158" />
      <SWire d="58,42 130,42" />
      <SWire d="58,158 242,158" />
      <STerm x={58} y={42} c={T.cyan} />
      <SLbl x={58} y={32} t="Vin" c={T.cyan} />
      <SRes x={58} y={82} vert />
      <SLbl x={74} y={86} t="R₁" c={T.txt} anchor="start" />
      <SRes x={58} y={128} vert />
      <SLbl x={74} y={132} t="R₂" c={T.txt} anchor="start" />
      <SWire d="58,128 130,128" />
      <STerm x={130} y={128} c={T.green} />
      <SLbl x={148} y={124} t="Vout" c={T.green} anchor="start" />
      <SGnd x={150} y={158} />
      <SLbl x={150} y={196 - 24} t="Vout = Vin · R₂ / (R₁ + R₂)" c={T.dim} size={9.5} />
    </SVGBox>
  );
}

/* ---------- schémas filtres ---------- */
function RCLowPassSchema() {
  return (
    <SVGBox vb="0 0 300 175">
      <STerm x={42} y={58} c={T.cyan} />
      <SLbl x={42} y={48} t="Vin" c={T.cyan} />
      <SWire d="42,58 92,58" />
      <SRes x={130} y={58} />
      <SLbl x={130} y={42} t="R" c={T.txt} />
      <SWire d="168,58 232,58" />
      <SDot x={232} y={58} />
      <SWire d="232,58 232,80" />
      <SCap x={232} y={98} vert />
      <SLbl x={248} y={102} t="C" c={T.txt} anchor="start" />
      <SWire d="232,116 232,150" />
      <SWire d="42,150 232,150" />
      <SWire d="232,58 280,58" />
      <STerm x={280} y={58} c={T.green} />
      <SLbl x={280} y={48} t="Vout" c={T.green} />
      <SGnd x={137} y={150} />
      <SLbl x={150} y={170} t="Sortie sur C → passe-bas" c={T.dim} size={9.5} />
    </SVGBox>
  );
}
function RCHighPassSchema() {
  return (
    <SVGBox vb="0 0 300 175">
      <STerm x={42} y={58} c={T.cyan} />
      <SLbl x={42} y={48} t="Vin" c={T.cyan} />
      <SWire d="42,58 108,58" />
      <SCap x={130} y={58} />
      <SLbl x={130} y={40} t="C" c={T.txt} />
      <SWire d="152,58 232,58" />
      <SDot x={232} y={58} />
      <SWire d="232,58 232,76" />
      <SRes x={232} y={98} vert />
      <SLbl x={248} y={102} t="R" c={T.txt} anchor="start" />
      <SWire d="232,120 232,150" />
      <SWire d="42,150 232,150" />
      <SWire d="232,58 280,58" />
      <STerm x={280} y={58} c={T.green} />
      <SLbl x={280} y={48} t="Vout" c={T.green} />
      <SGnd x={137} y={150} />
      <SLbl x={150} y={170} t="Sortie sur R → passe-haut" c={T.dim} size={9.5} />
    </SVGBox>
  );
}

/* ---------- schémas AOP ---------- */
function AOPIdealSchema() {
  return (
    <SVGBox vb="0 0 300 165">
      <SAmp x={120} y={82} />
      <SWire d="60,58 120,58" />
      <SWire d="60,106 120,106" />
      <SWire d="174,82 240,82" />
      <STerm x={60} y={58} c={T.green} />
      <SLbl x={48} y={54} t="V+" c={T.green} anchor="end" />
      <STerm x={60} y={106} c={T.coral} />
      <SLbl x={48} y={110} t="V−" c={T.coral} anchor="end" />
      <STerm x={240} y={82} c={T.cyan} />
      <SLbl x={252} y={86} t="Vs" c={T.cyan} anchor="start" />
      <SLbl x={150} y={142} t="AOP idéal : i+ = i− = 0" c={T.dim} size={9.5} />
      <SLbl x={150} y={156} t="en régime linéaire : V+ = V−" c={T.dim} size={9.5} />
    </SVGBox>
  );
}
function AOPInvertingSchema() {
  return (
    <SVGBox vb="0 0 300 185">
      <SAmp x={140} y={88} />
      {/* entrée - via R1 */}
      <STerm x={28} y={64} c={T.cyan} />
      <SLbl x={28} y={54} t="Ve" c={T.cyan} />
      <SWire d="28,64 62,64" />
      <SRes x={84} y={64} />
      <SWire d="106,64 140,64" />
      {/* contre-réaction R2 */}
      <SWire d="140,64 140,30" />
      <SWire d="140,30 210,30" />
      <SRes x={170} y={30} />
      <SWire d="210,30 210,88" />
      {/* sortie */}
      <SWire d="194,88 250,88" />
      <SDot x={210} y={88} />
      <STerm x={250} y={88} c={T.green} />
      <SLbl x={262} y={92} t="Vs" c={T.green} anchor="start" />
      {/* entrée + à la masse */}
      <SWire d="140,112 110,112" />
      <SGnd x={110} y={112} />
      <SLbl x={84} y={50} t="R₁" c={T.txt} />
      <SLbl x={170} y={20} t="R₂" c={T.txt} />
      <SLbl x={150} y={170} t="Vs = − (R₂/R₁) · Ve  ·  inverseur" c={T.dim} size={9.5} />
    </SVGBox>
  );
}
function AOPNonInvertingSchema() {
  return (
    <SVGBox vb="0 0 300 190">
      <SAmp x={140} y={80} />
      {/* entrée + directe */}
      <STerm x={40} y={56} c={T.cyan} />
      <SLbl x={40} y={46} t="Ve" c={T.cyan} />
      <SWire d="40,56 140,56" />
      {/* sortie */}
      <SWire d="194,80 250,80" />
      <SDot x={222} y={80} />
      <STerm x={250} y={80} c={T.green} />
      <SLbl x={262} y={84} t="Vs" c={T.green} anchor="start" />
      {/* contre-réaction : sortie -> noeud - via R2, R1 vers masse */}
      <SWire d="222,80 222,128" />
      <SWire d="222,128 188,128" />
      <SRes x={166} y={128} />
      <SWire d="144,128 110,128" />
      <SDot x={110} y={128} />
      <SWire d="110,128 110,104" />
      <SWire d="110,104 140,104" />
      <SWire d="110,128 110,150" />
      <SRes x={110} y={163} vert />
      <SWire d="110,176 110,182" />
      <SGnd x={110} y={182} />
      <SLbl x={166} y={114} t="R₂" c={T.txt} />
      <SLbl x={126} y={167} t="R₁" c={T.txt} anchor="start" />
      <SLbl x={150} y={196 - 6} t="Vs = (1 + R₂/R₁) · Ve  ·  non-inverseur" c={T.dim} size={9.5} />
    </SVGBox>
  );
}
function AOPSuiveurSchema() {
  return (
    <SVGBox vb="0 0 300 165">
      <SAmp x={130} y={78} />
      <STerm x={42} y={54} c={T.cyan} />
      <SLbl x={42} y={44} t="Ve" c={T.cyan} />
      <SWire d="42,54 130,54" />
      <SWire d="184,78 246,78" />
      <SDot x={214} y={78} />
      <STerm x={246} y={78} c={T.green} />
      <SLbl x={258} y={82} t="Vs" c={T.green} anchor="start" />
      <SWire d="214,78 214,118" />
      <SWire d="214,118 130,118" />
      <SWire d="130,118 130,102" />
      <SLbl x={150} y={146} t="Vs = Ve  ·  suiveur (adaptateur d'impédance)" c={T.dim} size={9} />
    </SVGBox>
  );
}
function AOPComparateurSchema() {
  return (
    <SVGBox vb="0 0 300 170">
      <SAmp x={128} y={80} />
      <STerm x={56} y={56} c={T.green} />
      <SLbl x={44} y={52} t="Ve" c={T.green} anchor="end" />
      <SWire d="56,56 128,56" />
      <SWire d="68,104 128,104" />
      <SWire d="68,104 68,128" />
      <SGnd x={68} y={128} />
      <SLbl x={56} y={104} t="Vréf" c={T.coral} anchor="end" />
      <SWire d="182,80 244,80" />
      <STerm x={244} y={80} c={T.cyan} />
      <SLbl x={256} y={84} t="Vs" c={T.cyan} anchor="start" />
      <SLbl x={150} y={146} t="Pas de contre-réaction → SATURÉ" c={T.dim} size={9.5} />
      <SLbl x={150} y={159} t="V+ > V− → Vs = +Vsat   sinon −Vsat" c={T.dim} size={9} />
    </SVGBox>
  );
}
function AOPSchmittSchema() {
  return (
    <SVGBox vb="0 0 300 185">
      <SAmp x={132} y={84} />
      <STerm x={46} y={108} c={T.cyan} />
      <SLbl x={46} y={124} t="Ve" c={T.cyan} />
      <SWire d="46,108 132,108" />
      {/* sortie */}
      <SWire d="186,84 248,84" />
      <SDot x={216} y={84} />
      <STerm x={248} y={84} c={T.green} />
      <SLbl x={260} y={88} t="Vs" c={T.green} anchor="start" />
      {/* réaction positive vers entrée + */}
      <SWire d="216,84 216,40" />
      <SWire d="216,40 188,40" />
      <SRes x={166} y={40} />
      <SWire d="144,40 100,40" />
      <SDot x={100} y={40} />
      <SWire d="100,40 132,40" />
      <SWire d="100,40 100,60" />
      <SRes x={100} y={73} vert />
      <SWire d="100,86 100,92" />
      <SGnd x={100} y={92} />
      <SLbl x={166} y={28} t="R₂" c={T.txt} />
      <SLbl x={116} y={77} t="R₁" c={T.txt} anchor="start" />
      <SLbl x={150} y={172} t="Réaction sur + → hystérésis (2 seuils)" c={T.dim} size={9} />
    </SVGBox>
  );
}

/* ---------- esquisses de Bode ---------- */
function BodeAxes() {
  return (
    <g>
      <line x1={42} y1={26} x2={42} y2={124} stroke={T.dim} strokeWidth="1.6" />
      <line x1={42} y1={124} x2={276} y2={124} stroke={T.dim} strokeWidth="1.6" />
      <SLbl x={40} y={20} t="G (dB)" c={T.faint} anchor="start" size={9} />
      <SLbl x={270} y={138} t="log f" c={T.faint} anchor="end" size={9} />
    </g>
  );
}
function BodeLowPassSketch() {
  return (
    <SVGBox vb="0 0 300 160">
      <BodeAxes />
      <line x1={158} y1={48} x2={158} y2={124} stroke={T.faint} strokeWidth="1.3" strokeDasharray="4 3" />
      <polyline points="42,48 158,48 256,112" fill="none" stroke={T.green} strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx={158} cy={56} r="3.4" fill={T.coral} />
      <SLbl x={196} y={52} t="−3 dB" c={T.coral} anchor="start" size={9.5} />
      <SLbl x={90} y={42} t="0 dB" c={T.dim} size={9} />
      <SLbl x={158} y={138} t="f_c" c={T.amber} size={9.5} />
      <SLbl x={232} y={92} t="−20 dB/déc" c={T.dim} anchor="middle" size={8.5} />
      <SLbl x={150} y={154} t="Passe-bas : plat puis chute après f_c" c={T.dim} size={9} />
    </SVGBox>
  );
}
function BodeHighPassSketch() {
  return (
    <SVGBox vb="0 0 300 160">
      <BodeAxes />
      <line x1={158} y1={48} x2={158} y2={124} stroke={T.faint} strokeWidth="1.3" strokeDasharray="4 3" />
      <polyline points="56,112 158,48 256,48" fill="none" stroke={T.cyan} strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx={158} cy={56} r="3.4" fill={T.coral} />
      <SLbl x={196} y={52} t="−3 dB" c={T.coral} anchor="start" size={9.5} />
      <SLbl x={210} y={42} t="0 dB" c={T.dim} size={9} />
      <SLbl x={158} y={138} t="f_c" c={T.amber} size={9.5} />
      <SLbl x={96} y={92} t="+20 dB/déc" c={T.dim} size={8.5} />
      <SLbl x={150} y={154} t="Passe-haut : monte puis plat après f_c" c={T.dim} size={9} />
    </SVGBox>
  );
}
function BodeBandPassSketch() {
  return (
    <SVGBox vb="0 0 300 160">
      <BodeAxes />
      <polyline points="48,114 116,52 200,52 264,114" fill="none" stroke={T.amber} strokeWidth="2.4" strokeLinejoin="round" />
      <circle cx={116} cy={52} r="3.2" fill={T.coral} />
      <circle cx={200} cy={52} r="3.2" fill={T.coral} />
      <SLbl x={116} y={138} t="f_c1" c={T.amber} size={9} />
      <SLbl x={200} y={138} t="f_c2" c={T.amber} size={9} />
      <SLbl x={158} y={44} t="bande passante" c={T.dim} size={8.5} />
      <SLbl x={150} y={154} t="Passe-bande : une bosse entre f_c1 et f_c2" c={T.dim} size={9} />
    </SVGBox>
  );
}
function BodeBandStopSketch() {
  return (
    <SVGBox vb="0 0 300 160">
      <BodeAxes />
      <polyline points="48,52 110,52 158,104 206,52 268,52" fill="none" stroke={T.violet} strokeWidth="2.4" strokeLinejoin="round" />
      <SLbl x={158} y={120} t="f₀" c={T.amber} size={9} />
      <SLbl x={90} y={44} t="0 dB" c={T.dim} size={9} />
      <SLbl x={150} y={154} t="Coupe-bande : un creux autour de f₀" c={T.dim} size={9} />
    </SVGBox>
  );
}

/* ---------- schémas Thévenin / Norton / découplage ---------- */
function TheveninSchema() {
  return (
    <SVGBox vb="0 0 300 168">
      <SGen x={62} y={94} />
      <SWire d="62,78 62,46" /><SWire d="62,46 112,46" />
      <SRes x={140} y={46} />
      <SWire d="168,46 250,46" />
      <SWire d="62,110 62,142" /><SWire d="62,142 250,142" />
      <STerm x={250} y={46} c={T.cyan} />
      <SLbl x={250} y={36} t="A" c={T.cyan} />
      <STerm x={250} y={142} c={T.cyan} />
      <SLbl x={250} y={159} t="B" c={T.cyan} />
      <SLbl x={36} y={98} t="Eth" c={T.txt} anchor="end" />
      <SLbl x={140} y={30} t="Rth" c={T.txt} />
      <SLbl x={150} y={158} t="Tout circuit linéaire = Eth en série avec Rth" c={T.dim} size={9} />
    </SVGBox>
  );
}
function NortonSchema() {
  return (
    <SVGBox vb="0 0 300 168">
      <circle cx={80} cy={92} r="16" fill={T.bg4} stroke={T.txt} strokeWidth="1.8" />
      <line x1={80} y1={101} x2={80} y2={86} stroke={T.amber} strokeWidth="2" />
      <SArrow x={80} y={86} dir="up" />
      <SWire d="80,56 80,76" /><SWire d="80,108 80,128" />
      <SRes x={164} y={92} vert />
      <SWire d="164,56 164,73" /><SWire d="164,111 164,128" />
      <SWire d="80,56 250,56" /><SWire d="80,128 250,128" />
      <SDot x={164} y={56} /><SDot x={164} y={128} />
      <STerm x={250} y={56} c={T.cyan} /><SLbl x={250} y={46} t="A" c={T.cyan} />
      <STerm x={250} y={128} c={T.cyan} /><SLbl x={250} y={144} t="B" c={T.cyan} />
      <SLbl x={80} y={156} t="In" c={T.amber} />
      <SLbl x={188} y={96} t="Rn" c={T.txt} anchor="start" />
      <SLbl x={150} y={166 - 2} t="Équivalent Norton : In en parallèle avec Rn (= Rth)" c={T.dim} size={9} />
    </SVGBox>
  );
}
function DecouplageSchema() {
  return (
    <SVGBox vb="0 0 300 160">
      <STerm x={42} y={56} c={T.cyan} />
      <SLbl x={42} y={46} t="signal" c={T.cyan} />
      <SWire d="42,56 150,56" />
      <SDot x={150} y={56} />
      <SWire d="150,56 150,76" />
      <SCap x={150} y={94} vert />
      <SLbl x={167} y={98} t="C" c={T.txt} anchor="start" />
      <SArrow x={150} y={72} dir="down" c={T.coral} />
      <SLbl x={186} y={75} t="HF" c={T.coral} anchor="start" size={9} />
      <SWire d="150,112 150,130" />
      <SGnd x={150} y={130} />
      <SWire d="150,56 252,56" />
      <STerm x={252} y={56} c={T.green} />
      <SLbl x={252} y={46} t="circuit" c={T.green} />
      <SLbl x={150} y={152} t="Découplage : les hautes fréquences partent à la masse" c={T.dim} size={9} />
    </SVGBox>
  );
}

/* ---------- registre + bloc ---------- */
const SCHEMAS = {
  "thevenin": TheveninSchema,
  "norton": NortonSchema,
  "decouplage": DecouplageSchema,
  "ohm": OhmSchema,
  "mailles": MaillesSchema,
  "noeuds": NoeudsSchema,
  "diviseur": CircuitDividerSchema,
  "rc-passebas": RCLowPassSchema,
  "rc-passehaut": RCHighPassSchema,
  "aop-ideal": AOPIdealSchema,
  "aop-inverseur": AOPInvertingSchema,
  "aop-noninverseur": AOPNonInvertingSchema,
  "aop-suiveur": AOPSuiveurSchema,
  "aop-comparateur": AOPComparateurSchema,
  "aop-schmitt": AOPSchmittSchema,
  "bode-passebas": BodeLowPassSketch,
  "bode-passehaut": BodeHighPassSketch,
  "bode-passebande": BodeBandPassSketch,
  "bode-coupebande": BodeBandStopSketch,
};

function Schema({ name }) {
  const C = SCHEMAS[name];
  return C ? <C /> : null;
}

function SchemaBlock({ b }) {
  if (!SCHEMAS[b.name]) return null;
  return (
    <div style={{
      background: T.bg2, border: `1px solid ${T.line}`, borderLeft: `3px solid ${T.green}`,
      borderRadius: 10, padding: "12px 12px 10px", margin: "10px 0",
    }}>
      <Schema name={b.name} />
      {b.legend && (
        <p style={{
          fontSize: 11.5, color: T.dim, lineHeight: 1.5, margin: "8px 4px 0",
          textAlign: "center", fontStyle: "italic",
        }}>{b.legend}</p>
      )}
    </div>
  );
}

/* ================== COMPOSANTS UI ================== */

function subjectById(id) { return SUBJECTS.find((s) => s.id === id); }

function CodeBlock({ code, color }) {
  return (
    <pre style={{
      background: "#0b0c11", border: `1px solid ${T.line}`,
      borderLeft: `3px solid ${color || T.amber}`, borderRadius: 9,
      padding: "12px 14px", overflowX: "auto", margin: "9px 0",
      fontSize: 12.2, lineHeight: 1.65, fontFamily: "'JetBrains Mono', monospace",
      color: "#cfd4e0", whiteSpace: "pre",
    }}><code>{code}</code></pre>
  );
}

function Callout({ kind, title, children }) {
  const map = {
    tip: { c: T.green, label: "Astuce", bg: "rgba(95,207,142,0.09)" },
    warn: { c: T.coral, label: "Attention", bg: "rgba(236,106,94,0.09)" },
    info: { c: T.cyan, label: "Note", bg: "rgba(70,200,212,0.09)" },
  };
  const m = map[kind] || map.info;
  return (
    <div style={{
      background: m.bg, border: `1px solid ${m.c}33`, borderLeft: `3px solid ${m.c}`,
      borderRadius: 8, padding: "10px 13px", margin: "10px 0",
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1,
        textTransform: "uppercase", color: m.c, marginBottom: 3, fontWeight: 700,
      }}>{title || m.label}</div>
      <div style={{ fontSize: 13, color: T.txt, lineHeight: 1.58 }}>{children}</div>
    </div>
  );
}

function DataTable({ head, rows, color }) {
  return (
    <div style={{ overflowX: "auto", margin: "10px 0" }}>
      <table style={{ borderCollapse: "collapse", width: "100%", fontSize: 12.3 }}>
        <thead><tr>
          {head.map((h, i) => (
            <th key={i} style={{
              textAlign: "left", padding: "6px 10px", background: T.bg3,
              color: color || T.amber, fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, textTransform: "uppercase", letterSpacing: 0.5,
              border: `1px solid ${T.line}`,
            }}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td key={j} style={{
                  padding: "6px 10px", border: `1px solid ${T.line}`,
                  color: j === 0 ? T.txt : T.dim,
                  background: i % 2 ? T.bg2 : "transparent",
                  fontWeight: j === 0 ? 600 : 400, lineHeight: 1.5,
                }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Block({ b, color }) {
  if (b.t === "p")
    return <p style={{ fontSize: 13.6, lineHeight: 1.7, color: T.txt, margin: "8px 0" }}><MathText>{b.v}</MathText></p>;
  if (b.t === "list")
    return (
      <ul style={{ margin: "8px 0", paddingLeft: 2, listStyle: "none" }}>
        {b.v.map((it, i) => (
          <li key={i} style={{
            fontSize: 13.3, lineHeight: 1.62, color: T.txt, margin: "5px 0",
            paddingLeft: 18, position: "relative",
          }}>
            <span style={{ position: "absolute", left: 0, color: color || T.amber, fontWeight: 700 }}>›</span>
            <MathText>{it}</MathText>
          </li>
        ))}
      </ul>
    );
  if (b.t === "code") return <CodeBlock code={b.v} color={color} />;
  if (b.t === "formula") return <FormulaBlock b={b} color={color} />;
  if (b.t === "schema") return <SchemaBlock b={b} />;
  if (b.t === "note") return <Callout kind={b.kind} title={b.title}>{b.v}</Callout>;
  if (b.t === "table") return <DataTable head={b.head} rows={b.rows} color={color} />;
  return null;
}

/* --- styles helpers --- */
function panelSt() {
  return {
    background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 13,
    padding: "14px 16px", marginBottom: 11,
    boxShadow: "0 2px 10px -8px rgba(0,0,0,0.6)",
  };
}
function PanelLabel({ color, children }) {
  return (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1.3,
      textTransform: "uppercase", color, fontWeight: 700, marginBottom: 6,
    }}>{children}</div>
  );
}
function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: 1.8,
      textTransform: "uppercase", color: T.faint, margin: "6px 0 11px",
    }}>{children}</div>
  );
}
function primBtn(color) {
  return {
    background: color, color: T.bg, border: "none", borderRadius: 10,
    padding: "11px 18px", cursor: "pointer",
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, fontWeight: 800,
    boxShadow: `0 4px 14px -6px ${color}aa`,
  };
}
function ghostBtn() {
  return {
    background: T.bg2, color: T.dim, border: `1px solid ${T.line}`,
    borderRadius: 9, padding: "9px 13px", cursor: "pointer",
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 600,
  };
}
function titleSt(size) {
  return {
    fontFamily: "'JetBrains Mono', monospace", fontSize: size || 21, fontWeight: 800,
    color: T.txt, margin: 0,
  };
}
function chip(color, active) {
  return {
    background: active ? color : T.bg2, color: active ? T.bg : T.dim,
    border: `1px solid ${active ? color : T.line}`, borderRadius: 8,
    padding: "6px 11px", cursor: "pointer", whiteSpace: "nowrap",
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700,
  };
}
function SubjectBadge({ subject, small }) {
  const sj = subjectById(subject);
  if (!sj) return null;
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: small ? 8.5 : 9.5, fontWeight: 700,
      color: sj.color, background: `${sj.color}1c`, border: `1px solid ${sj.color}55`,
      borderRadius: 5, padding: small ? "1px 5px" : "2px 7px", whiteSpace: "nowrap",
    }}>{sj.name}</span>
  );
}
function TypeBadge({ label, color }) {
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700,
      color: color, border: `1px solid ${color}66`, borderRadius: 5,
      padding: "2px 7px", whiteSpace: "nowrap", textTransform: "uppercase", letterSpacing: 0.4,
    }}>{label}</span>
  );
}

/* --- anneau de progression SVG --- */
function Ring({ pct, label, sub, color, size }) {
  const sz = size || 78, r = sz / 2 - 7, c = 2 * Math.PI * r;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
        <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={T.bg3} strokeWidth="7" />
        <circle cx={sz/2} cy={sz/2} r={r} fill="none" stroke={color} strokeWidth="7"
          strokeDasharray={c} strokeDashoffset={c - (c * Math.min(pct, 100)) / 100}
          strokeLinecap="round" transform={`rotate(-90 ${sz/2} ${sz/2})`}
          style={{ transition: "stroke-dashoffset 0.7s ease" }} />
        <text x={sz/2} y={sz/2 + 5} textAnchor="middle" fill={T.txt}
          fontSize="15" fontWeight="700" fontFamily="'JetBrains Mono', monospace">{label}</text>
      </svg>
      {sub && <div style={{ fontSize: 10.5, color: T.dim, marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

/* --- carte retournable (flashcard) --- */
function FlipCard({ card, flipped, onFlip, color }) {
  const typeLabels = { def: "Définition", formule: "Formule", piege: "Piège", methode: "Méthode" };
  return (
    <div onClick={onFlip}
      style={{
        background: flipped ? T.bg3 : T.bg2,
        border: `1px solid ${flipped ? color : T.line}`, borderRadius: 16,
        padding: "26px 22px", cursor: "pointer", minHeight: 220,
        display: "flex", flexDirection: "column", justifyContent: "center",
        textAlign: "center", transition: "all 0.18s", position: "relative",
      }}>
      <div style={{
        position: "absolute", top: 13, left: 15, fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9.5, letterSpacing: 1, textTransform: "uppercase",
        color: color, fontWeight: 700,
      }}>{typeLabels[card.type] || card.type} · {card.chapter}</div>
      <div style={{
        position: "absolute", top: 13, right: 15, fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9.5, color: T.faint,
      }}>{flipped ? "réponse" : "question"}</div>
      <div style={{
        fontSize: flipped ? 14 : 16.5, lineHeight: 1.6,
        color: flipped ? T.txt : T.txt,
        fontWeight: flipped ? 400 : 600,
        fontFamily: flipped && /[=∫√ωₐ]/.test(card.back) ? "'JetBrains Mono', monospace" : "'Spectral', serif",
        whiteSpace: "pre-wrap",
      }}>{flipped ? card.back : card.front}</div>
      <div style={{
        marginTop: 14, fontSize: 10.5, color: T.faint,
        fontFamily: "'JetBrains Mono', monospace",
      }}>{flipped ? "" : "tape pour retourner"}</div>
    </div>
  );
}

/* --- en-tête de page (retour) --- */
function BackBar({ onBack, label }) {
  return (
    <button onClick={onBack} style={{ ...ghostBtn(), marginBottom: 13 }}>
      ‹ {label}
    </button>
  );
}

/* --- pastille difficulté --- */
function DiffBadge({ d }) {
  const map = {
    facile: { c: T.green, l: "Facile" },
    moyen: { c: T.amber, l: "Moyen" },
    partiel: { c: T.coral, l: "Niveau partiel" },
    normal: { c: T.cyan, l: "Niveau normal" },
    difficile: { c: T.coral, l: "Partiel difficile" },
    reel: { c: T.pink, l: "Vrai partiel" },
  };
  const m = map[d] || map.moyen;
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700,
      color: m.c, border: `1px solid ${m.c}66`, borderRadius: 5,
      padding: "3px 7px", whiteSpace: "nowrap",
    }}>{m.l}</span>
  );
}

/* ================== ACCUEIL ================== */

function Home({ go, progress }) {
  const [q, setQ] = useState("");
  const subjectsRef = useRef(null);
  const scrollSubjects = () => {
    if (subjectsRef.current) subjectsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const readCount = (progress.fiches || []).length;
  const quizKeys = Object.keys(progress.quiz || {});
  const exoCount = (progress.exos || []).length;
  const knownCards = Object.values(progress.cards || {}).filter((v) => v === "ok").length;
  const globalPct = Math.round(
    (((readCount / ALL_FICHES.length) + (exoCount / EXOS.length) +
      (quizKeys.length / QUIZZES.length) + (knownCards / FLASHCARDS.length)) / 4) * 100
  );

  function submitSearch() {
    if (q.trim()) go({ view: "search", q: q.trim() });
  }

  return (
    <div>
      <div style={{
        background: `linear-gradient(145deg, ${T.bg3} 0%, ${T.bg2} 45%, ${T.bg} 100%)`,
        border: `1px solid ${T.line}`, borderRadius: 18, padding: "26px 22px 22px",
        marginBottom: 16, position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", right: -50, top: -50, width: 220, height: 220,
          background: `radial-gradient(circle, ${T.amber}26, transparent 70%)`, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: 70, bottom: -80, width: 190, height: 190,
          background: `radial-gradient(circle, ${T.violet}1c, transparent 70%)`, pointerEvents: "none",
        }} />
        <div style={{ position: "relative" }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 2.4,
            color: T.amber, marginBottom: 9,
          }}>ING1 · ECE PARIS · SEMESTRE 2</div>
          <h1 style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 33, fontWeight: 800,
            color: T.txt, margin: "0 0 7px", lineHeight: 1.08,
          }}>Prêt à réviser ?</h1>
          <p style={{ color: T.dim, fontSize: 14, margin: "0 0 17px", fontStyle: "italic", lineHeight: 1.5 }}>
            Tout ton ING1 au même endroit — fiches, formules, quiz et annales.<br />
            Révise vite, révise bien.
          </p>

          <div style={{ marginBottom: 17 }}>
            <div style={{
              display: "flex", justifyContent: "space-between",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.faint, marginBottom: 5,
            }}>
              <span>PROGRESSION GLOBALE</span><span style={{ color: T.txt, fontWeight: 700 }}>{globalPct}%</span>
            </div>
            <div style={{ height: 8, background: T.bg, borderRadius: 4, overflow: "hidden", border: `1px solid ${T.line}` }}>
              <div style={{
                width: `${Math.max(globalPct, 2)}%`, height: "100%",
                background: `linear-gradient(90deg, ${T.amber}, ${T.green})`, transition: "width .7s ease",
              }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[
              { v: "quiz", l: "Quiz", i: "✓", c: T.cyan },
              { v: "flashcards", l: "Flashcards", i: "⮂", c: T.violet },
              { v: "exos", l: "Exercices", i: "✎", c: T.amber },
              { v: "formules", l: "Formules", i: "∑", c: T.yellow },
              { v: "training", l: "Annales", i: "◈", c: T.green },
              { v: "videos", l: "Vidéos", i: "▶", c: T.coral },
            ].map((s) => (
              <button key={s.v} onClick={() => go({ view: s.v })} className="ece-pill"
                style={{
                  display: "flex", alignItems: "center", gap: 7, background: T.bg2,
                  border: `1px solid ${s.c}55`, color: T.txt, borderRadius: 10,
                  padding: "9px 13px", cursor: "pointer", fontSize: 12, fontWeight: 700,
                }}>
                <span style={{ color: s.c, fontSize: 13 }}>{s.i}</span>{s.l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TU VEUX RÉVISER QUOI */}
      <div style={{
        background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 16,
        padding: "18px 18px 20px", marginBottom: 14,
      }}>
        <h3 style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 800,
          color: T.txt, margin: "0 0 13px",
        }}>Tu veux réviser quoi maintenant ?</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 9 }}>
          {[
            { l: "Apprendre le cours", d: "Fiches & résumés par matière", i: "▣", c: T.cyan, act: scrollSubjects },
            { l: "M'entraîner", d: "Exercices corrigés", i: "✎", c: T.amber, act: () => go({ view: "exos" }) },
            { l: "Revoir les formules", d: "Formulaire complet rendu", i: "∑", c: T.yellow, act: () => go({ view: "formules" }) },
            { l: "J'ai bientôt partiel", d: "Plan de révision express", i: "⏰", c: T.coral, act: () => go({ view: "partielsoon" }) },
          ].map((b) => (
            <button key={b.l} onClick={b.act} className="ece-card"
              style={{
                display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 4,
                background: T.bg3, border: `1px solid ${b.c}44`, borderRadius: 12,
                padding: "13px 13px 14px", cursor: "pointer", textAlign: "left",
              }}>
              <span style={{
                width: 34, height: 34, borderRadius: 9, background: `${b.c}20`,
                border: `1px solid ${b.c}55`, color: b.c, fontSize: 16,
                display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4,
              }}>{b.i}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.7, fontWeight: 800, color: T.txt }}>{b.l}</span>
              <span style={{ fontSize: 11, color: T.dim, lineHeight: 1.4, fontFamily: "'Spectral', serif" }}>{b.d}</span>
            </button>
          ))}
        </div>
      </div>

      {/* CONTINUER MA RÉVISION */}
      {(() => {
        const recos = [
          { ratio: readCount / ALL_FICHES.length, title: "Lire des fiches de cours",
            desc: `${readCount}/${ALL_FICHES.length} fiches lues — continue à parcourir les résumés.`,
            label: "Voir les matières", c: T.cyan, i: "▣", act: scrollSubjects },
          { ratio: exoCount / EXOS.length, title: "Faire des exercices",
            desc: `${exoCount}/${EXOS.length} exercices faits — entraîne-toi sur des exos corrigés.`,
            label: "Aller aux exercices", c: T.amber, i: "✎", act: () => go({ view: "exos" }) },
          { ratio: quizKeys.length / QUIZZES.length, title: "Tester tes connaissances",
            desc: `${quizKeys.length}/${QUIZZES.length} quiz tentés — vérifie ce que tu retiens.`,
            label: "Lancer un quiz", c: T.green, i: "✓", act: () => go({ view: "quiz" }) },
          { ratio: knownCards / FLASHCARDS.length, title: "Réviser les flashcards",
            desc: `${knownCards}/${FLASHCARDS.length} cartes sues — mémorise les notions clés.`,
            label: "Ouvrir les flashcards", c: T.violet, i: "⮂", act: () => go({ view: "flashcards" }) },
        ];
        const reco = recos.slice().sort((a, b) => a.ratio - b.ratio)[0];
        return (
          <div style={{
            background: `linear-gradient(135deg, ${reco.c}1c, ${T.bg2})`,
            border: `1px solid ${reco.c}55`, borderRadius: 14, padding: "15px 16px", marginBottom: 22,
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1.4,
              color: reco.c, fontWeight: 700, marginBottom: 7,
            }}>CONTINUER MA RÉVISION</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{
                width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                background: `${reco.c}22`, border: `1px solid ${reco.c}55`, color: reco.c,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19,
              }}>{reco.i}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13.5, fontWeight: 800, color: T.txt }}>
                  {reco.title}
                </div>
                <div style={{ fontSize: 11.7, color: T.dim, marginTop: 2, lineHeight: 1.45 }}>{reco.desc}</div>
              </div>
            </div>
            <button onClick={reco.act} style={{ ...primBtn(reco.c), width: "100%", marginTop: 11 }}>
              {reco.label}
            </button>
          </div>
        );
      })()}

      {/* recherche globale */}
      <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submitSearch(); }}
          placeholder="Rechercher dans tout le site (malloc, intégrale, oscillateur, AOP…)"
          style={{
            flex: 1, background: T.bg2, border: `1px solid ${T.line}`,
            borderRadius: 10, padding: "11px 14px", color: T.txt, fontSize: 13,
            fontFamily: "'Spectral', serif", outline: "none",
          }}
        />
        <button onClick={submitSearch} style={primBtn(T.amber)}>OK</button>
      </div>

      {/* cartes matières */}
      <div ref={subjectsRef} style={{ scrollMarginTop: 110 }} />
      <SectionLabel>Les 4 matières</SectionLabel>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(225px,1fr))", gap: 12,
        marginBottom: 22,
      }}>
        {SUBJECTS.map((s) => {
          const nf = fichesOf(s.id).length;
          return <SubjectCard key={s.id} s={s} nf={nf} onClick={() => go({ view: "subject", id: s.id })} />;
        })}
      </div>

      {/* accès rapides */}
      <SectionLabel>Accès rapides</SectionLabel>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 10,
        marginBottom: 22,
      }}>
        <QuickBtn color={T.blue} icon="◷" title="Dashboard" desc="Progression + quoi réviser" onClick={() => go({ view: "dashboard" })} />
        <QuickBtn color={T.coral} icon="⚡" title="Parcours de révision" desc="7 parcours selon ton temps" onClick={() => go({ view: "express" })} />
        <QuickBtn color={T.violet} icon="⮂" title="Flashcards" desc={`${FLASHCARDS.length} cartes`} onClick={() => go({ view: "flashcards" })} />
        <QuickBtn color={T.amber} icon="✎" title="Exercices / Annales" desc={`${EXOS.length} exercices corrigés`} onClick={() => go({ view: "exos" })} />
        <QuickBtn color={T.green} icon="◈" title="Annales & entraînement" desc={`${SUJETS.length} sujets`} onClick={() => go({ view: "training" })} />
        <QuickBtn color={T.cyan} icon="✓" title="Quiz" desc={`${QUIZZES.length} quiz + mode partiel`} onClick={() => go({ view: "quiz" })} />
      </div>

      <SectionLabel>Outils & méthodes</SectionLabel>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 10,
        marginBottom: 22,
      }}>
        <QuickBtn color={T.pink} icon="⚙" title="Générer un sujet" desc="Partiel sur mesure" onClick={() => go({ view: "generateur" })} />
        <QuickBtn color={T.blue} icon="⏱" title="Partiel blanc" desc="Sujet chronométré + bilan" onClick={() => go({ view: "partielblanc" })} />
        <QuickBtn color={T.pink} icon="★" title="Réviser une annale" desc="Vrais partiels guidés" onClick={() => go({ view: "reviserannale" })} />
        <QuickBtn color={T.amber} icon="◆" title="Ce qui tombe souvent" desc="Chapitres & pièges récurrents" onClick={() => go({ view: "tombe" })} />
        <QuickBtn color={T.cyan} icon="◎" title="Méthodes types" desc="Reconnaître chaque exo" onClick={() => go({ view: "methodes" })} />
        <QuickBtn color={T.yellow} icon="∑" title="Formules" desc={`${FORMULAS.length} formules rendues`} onClick={() => go({ view: "formules" })} />
        <QuickBtn color={T.cyan} icon="∑" title="Quiz formules" desc="S'entraîner sur les formules" onClick={() => go({ view: "formulesquiz" })} />
        <QuickBtn color={T.green} icon="✓" title="Méthodes de partiel" desc="Gérer énoncé, temps, copie" onClick={() => go({ view: "methodespartiel" })} />
        <QuickBtn color={T.coral} icon="✗" title="Erreurs fréquentes" desc="Les pièges à éviter" onClick={() => go({ view: "erreurs" })} />
        <QuickBtn color={T.green} icon="?" title="Je comprends rien" desc="Les bases en très simple" onClick={() => go({ view: "debutant" })} />
        <QuickBtn color={T.coral} icon="▶" title="Ressources vidéo" desc={`${VIDEOS.length} vidéos YouTube`} onClick={() => go({ view: "videos" })} />
        <QuickBtn color={T.violet} icon="▤" title="Bibliothèque" desc={`${DOCS.length} documents du zip`} onClick={() => go({ view: "documents" })} />
      </div>

      {/* progression */}
      <SectionLabel>Ta progression</SectionLabel>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px,1fr))", gap: 11,
        marginBottom: 22,
      }}>
        <StatRing pct={(readCount / ALL_FICHES.length) * 100} label={`${readCount}/${ALL_FICHES.length}`} sub="fiches lues" color={T.cyan} />
        <StatRing pct={(exoCount / EXOS.length) * 100} label={`${exoCount}/${EXOS.length}`} sub="exos faits" color={T.amber} />
        <StatRing pct={(quizKeys.length / QUIZZES.length) * 100} label={`${quizKeys.length}/${QUIZZES.length}`} sub="quiz tentés" color={T.green} />
        <StatRing pct={(knownCards / FLASHCARDS.length) * 100} label={`${knownCards}/${FLASHCARDS.length}`} sub="cartes sues" color={T.violet} />
      </div>

      {/* à réviser en priorité */}
      <SectionLabel>Quoi réviser maintenant</SectionLabel>
      <div style={panelSt()}>
        {[
          { s: "info", t: "Compléter un main", d: "init → remplissage → traitement → libération mémoire." },
          { s: "info", t: "Structure à champ dynamique", d: "typedef struct + char* alloué, libéré dans le bon ordre." },
          { s: "math", t: "DL usuels en 0", d: "eˣ, ln(1+x), sin, cos, (1+x)ᵅ — à connaître par cœur." },
          { s: "math", t: "Nature d'une intégrale", d: "équivalent en la borne + comparaison à Riemann." },
          { s: "meca", t: "Mise en équation d'un oscillateur", d: "par les forces ou par l'énergie : ẍ + ω₀²x = 0." },
          { s: "elec", t: "Diviseur de tension", d: "U₂ = U·R₂/(R₁+R₂) — la formule qui sauve." },
        ].map((p, i) => {
          const sj = subjectById(p.s);
          return (
            <div key={i} onClick={() => go({ view: "subject", id: p.s })}
              className="ece-row"
              style={{
                display: "flex", alignItems: "center", gap: 11, padding: "10px 8px",
                borderBottom: i < 5 ? `1px solid ${T.line}` : "none", cursor: "pointer",
                borderRadius: 8,
              }}>
              <div style={{ width: 7, height: 7, borderRadius: 2, background: sj.color, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.3, color: T.txt, fontWeight: 600 }}>{p.t}</div>
                <div style={{ fontSize: 11.7, color: T.dim, marginTop: 1 }}>{p.d}</div>
              </div>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: sj.color,
              }}>{sj.name.toUpperCase()}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SubjectCard({ s, nf, onClick }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className="ece-card"
      style={{
        background: T.bg2, border: `1px solid ${h ? s.color : T.line}`, borderRadius: 14,
        padding: "17px", cursor: "pointer",
      }}>
      <div style={{
        width: 42, height: 42, borderRadius: 11, background: `${s.color}1e`,
        border: `1px solid ${s.color}55`, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 20, color: s.color,
        fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, marginBottom: 11,
      }}>{s.glyph}</div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 16, fontWeight: 800,
        color: T.txt,
      }}>{s.name}</div>
      <div style={{ fontSize: 11, color: s.color, fontFamily: "'JetBrains Mono', monospace", marginTop: 1 }}>{s.short}</div>
      <div style={{ fontSize: 12.3, color: T.dim, lineHeight: 1.5, marginTop: 7 }}>{s.tagline}</div>
      <div style={{
        marginTop: 10, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
        color: T.faint,
      }}>{nf} fiches · {EXOS.filter((e) => e.subject === s.id).length} exos · {sujetsOf(s.id).length} sujets</div>
    </div>
  );
}

function QuickBtn({ color, icon, title, desc, onClick }) {
  const [h, setH] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      className="ece-card"
      style={{
        background: T.bg2, border: `1px solid ${h ? color : T.line}`, borderRadius: 13,
        padding: "13px 14px", cursor: "pointer",
      }}>
      <div style={{
        width: 33, height: 33, borderRadius: 9, background: `${color}1e`,
        border: `1px solid ${color}44`, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 15.5, color: color, marginBottom: 9,
      }}>{icon}</div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 12.7, fontWeight: 700, color: T.txt,
      }}>{title}</div>
      <div style={{ fontSize: 11.2, color: T.dim, marginTop: 2, lineHeight: 1.42 }}>{desc}</div>
    </div>
  );
}

function StatRing({ pct, label, sub, color }) {
  return (
    <div style={{
      background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 12,
      padding: "13px 8px", display: "flex", justifyContent: "center",
    }}>
      <Ring pct={pct} label={label} sub={sub} color={color} />
    </div>
  );
}

/* ================== PAGE MATIÈRE ================== */

function SubjectView({ subjectId, progress, handlers, go }) {
  const s = subjectById(subjectId);
  const [tab, setTab] = useState("fiches");
  const fiches = fichesOf(subjectId);
  const exos = EXOS.filter((e) => e.subject === subjectId);
  const quizzes = QUIZZES.filter((q) => q.subject === subjectId);
  const cards = FLASHCARDS.filter((c) => c.subject === subjectId);
  const docs = DOCS.filter((d) => d.subject === subjectId);
  const trainings = sujetsOf(subjectId);

  const innerTabs = [
    { id: "fiches", label: `Fiches (${fiches.length})` },
    { id: "exos", label: `Exercices (${exos.length})` },
    { id: "quiz", label: `Quiz (${quizzes.length})` },
    { id: "cards", label: `Flashcards (${cards.length})` },
    { id: "docs", label: `Documents (${docs.length})` },
  ];

  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />

      <div style={{
        background: `linear-gradient(130deg, ${s.color}1c, ${T.bg2})`,
        border: `1px solid ${s.color}44`, borderRadius: 14, padding: "18px 18px",
        marginBottom: 14, display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, background: `${s.color}22`,
          border: `1px solid ${s.color}66`, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 23, color: s.color,
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, flexShrink: 0,
        }}>{s.glyph}</div>
        <div>
          <h2 style={titleSt(22)}>{s.name}</h2>
          <div style={{ fontSize: 12.5, color: T.dim, marginTop: 3 }}>{s.tagline}</div>
        </div>
      </div>

      {/* sujets d'entraînement de la matière */}
      <div onClick={() => go({ view: "training", subject: subjectId })}
        style={{
          background: T.bg2, border: `1px solid ${T.green}44`, borderRadius: 11,
          padding: "11px 14px", marginBottom: 14, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 10,
        }}>
        <span style={{ fontSize: 17, color: T.green }}>◈</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, fontWeight: 700, color: T.txt }}>
            {trainings.length} sujets : annales & entraînement
          </div>
          <div style={{ fontSize: 11.3, color: T.dim }}>Vrais partiels du zip + sujets inédits, avec correction détaillée.</div>
        </div>
        <span style={{ color: T.faint, fontSize: 17 }}>›</span>
      </div>

      {/* onglets internes */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 14 }}>
        {innerTabs.map((it) => (
          <button key={it.id} onClick={() => setTab(it.id)} style={chip(s.color, tab === it.id)}>
            {it.label}
          </button>
        ))}
      </div>

      {subjectId === "elec" && (
        <div style={{
          background: `${T.green}10`, border: `1px solid ${T.green}44`, borderRadius: 11,
          padding: "11px 13px", marginBottom: 13, display: "flex", gap: 7, flexWrap: "wrap",
        }}>
          <div style={{ width: "100%", fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: T.green, fontWeight: 700, marginBottom: 1 }}>
            SPÉCIAL ÉLECTRONIQUE
          </div>
          <button onClick={() => go({ view: "dselec" })} style={primBtn(T.green)}>◈ DS corrigés</button>
          <button onClick={() => go({ view: "reconnaitreelec" })} style={ghostBtn()}>◆ Reconnaître un exo</button>
          <button onClick={() => go({ view: "schemaselec" })} style={ghostBtn()}>⏚ Schémas</button>
          <button onClick={() => go({ view: "methodeelec" })} style={ghostBtn()}>◎ Méthodes TP</button>
          <button onClick={() => go({ view: "formules", subject: "elec" })} style={ghostBtn()}>∑ Formules élec</button>
          <button onClick={() => go({ view: "formulesquiz" })} style={ghostBtn()}>⊕ Quiz formules</button>
          <button onClick={() => go({ view: "entrainementelec" })} style={ghostBtn()}>✎ Exercices des DS</button>
        </div>
      )}

      {tab === "fiches" && <FichesPanel fiches={fiches} color={s.color} progress={progress} handlers={handlers} go={go} />}
      {tab === "exos" && <ExoList exos={exos} progress={progress} handlers={handlers} />}
      {tab === "quiz" && <QuizList quizzes={quizzes} progress={progress} handlers={handlers} />}
      {tab === "cards" && <CardDeck cards={cards} subjectId={subjectId} progress={progress} handlers={handlers} />}
      {tab === "docs" && <DocList docs={docs} go={go} />}
    </div>
  );
}

/* ================== FICHES ================== */

function FichesPanel({ fiches, color, progress, handlers, go }) {
  const [open, setOpen] = useState(null);
  if (open) {
    const f = fiches.find((x) => x.id === open);
    return <FicheReader fiche={f} color={color} progress={progress} handlers={handlers} back={() => setOpen(null)} go={go} />;
  }
  return (
    <div>
      <SectionLabel>Résumé du cours · fiches</SectionLabel>
      {fiches.map((f) => {
        const st = (progress.ficheStatus || {})[f.id];
        return (
          <div key={f.id} onClick={() => setOpen(f.id)}
            style={{
              background: T.bg2, border: `1px solid ${T.line}`,
              borderLeft: `3px solid ${color}`, borderRadius: 11,
              padding: "12px 15px", marginBottom: 9, cursor: "pointer",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: T.txt,
                flex: 1,
              }}>{f.title}</div>
              {st === "ok" && <span style={{ color: T.green, fontSize: 13 }}>✓</span>}
              {st === "revoir" && <span style={{ color: T.coral, fontSize: 13 }}>↻</span>}
              <span style={{ color: T.faint, fontSize: 16 }}>›</span>
            </div>
            <div style={{ fontSize: 11.5, color: color, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{f.sub}</div>
            <div style={{ fontSize: 12.4, color: T.dim, lineHeight: 1.5, marginTop: 5 }}>{f.blurb}</div>
          </div>
        );
      })}
    </div>
  );
}

function FicheReader({ fiche, color, progress, handlers, back, go }) {
  const topRef = useRef(null);
  useEffect(() => {
    handlers.markFiche(fiche.id);
    if (topRef.current) topRef.current.scrollIntoView({ block: "start" });
  }, [fiche.id]);
  const st = (progress.ficheStatus || {})[fiche.id];

  return (
    <div ref={topRef}>
      <BackBar onBack={back} label="Toutes les fiches" />
      <div style={{ borderLeft: `3px solid ${color}`, paddingLeft: 13, marginBottom: 14 }}>
        <h2 style={titleSt(20)}>{fiche.title}</h2>
        <div style={{ fontSize: 12, color, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{fiche.sub}</div>
        <p style={{ fontSize: 13, color: T.dim, lineHeight: 1.6, margin: "8px 0 0" }}>{fiche.blurb}</p>
      </div>

      {fiche.sections.map((sec, i) => (
        <div key={i} style={panelSt()}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 3 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color, fontWeight: 700,
            }}>{String(i + 1).padStart(2, "0")}</span>
            <h3 style={{
              fontSize: 14.5, fontWeight: 700, color: T.txt, margin: 0,
              fontFamily: "'JetBrains Mono', monospace",
            }}>{sec.title}</h3>
          </div>
          {sec.blocks.map((b, j) => <Block key={j} b={b} color={color} />)}
        </div>
      ))}

      <div style={{
        display: "flex", gap: 9, alignItems: "center", flexWrap: "wrap",
        background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 11,
        padding: "12px 14px",
      }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.dim }}>Où en es-tu ?</span>
        <button onClick={() => handlers.setStatus(fiche.id, st === "ok" ? null : "ok")}
          style={{
            background: st === "ok" ? T.green : T.bg3, color: st === "ok" ? T.bg : T.dim,
            border: `1px solid ${st === "ok" ? T.green : T.line}`, borderRadius: 8,
            padding: "8px 12px", cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700,
          }}>✓ Je maîtrise</button>
        <button onClick={() => handlers.setStatus(fiche.id, st === "revoir" ? null : "revoir")}
          style={{
            background: st === "revoir" ? T.coral : T.bg3, color: st === "revoir" ? T.bg : T.dim,
            border: `1px solid ${st === "revoir" ? T.coral : T.line}`, borderRadius: 8,
            padding: "8px 12px", cursor: "pointer",
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700,
          }}>↻ À revoir</button>
      </div>

      <LiensFiche fiche={fiche} color={color} go={go} />
    </div>
  );
}

function LiensFiche({ fiche, color, go }) {
  const sub = fiche.subject;
  const sj = subjectById(sub);
  const words = (fiche.title + " " + fiche.sub).toLowerCase().split(/[^a-zàâçéèêëîïôûùü]+/).filter((w) => w.length > 3);
  const matchChap = (chap) => {
    const c = chap.toLowerCase();
    return words.some((w) => c.includes(w) || w.includes(c));
  };
  let cards = FLASHCARDS.filter((c) => c.subject === sub && matchChap(c.chapter));
  if (cards.length < 3) cards = FLASHCARDS.filter((c) => c.subject === sub);
  let exos = EXOS.filter((e) => e.subject === sub && e.tags.some((t) => matchChap(t)));
  if (exos.length === 0) exos = EXOS.filter((e) => e.subject === sub);
  const quiz = QUIZZES.filter((q) => q.subject === sub);
  const annales = ANNALES.filter((a) => a.subject === sub);
  const docs = DOCS.filter((d) => d.subject === sub);
  let videos = VIDEOS.filter((v) => v.subject === sub && matchChap(v.chapter));
  if (videos.length === 0) videos = VIDEOS.filter((v) => v.subject === sub);
  const formules = (typeof FORMULAS !== "undefined" ? FORMULAS : []).filter((f) => f.subject === sub);

  const Row = ({ icon, label, n, target }) => (
    <div onClick={() => go(target)}
      style={{
        display: "flex", alignItems: "center", gap: 9, padding: "8px 11px",
        background: T.bg3, border: `1px solid ${T.line}`, borderRadius: 8,
        marginBottom: 6, cursor: "pointer",
      }}>
      <span style={{ color, fontSize: 13, width: 16, textAlign: "center" }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 12.5, color: T.txt }}>{label}</span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: T.faint }}>{n}</span>
      <span style={{ color: T.faint, fontSize: 14 }}>›</span>
    </div>
  );

  return (
    <div style={{ ...panelSt(), marginTop: 11 }}>
      <PanelLabel color={color}>Contenus liés · {sj.name}</PanelLabel>
      <Row icon="✎" label="Exercices à faire" n={exos.length} target={{ view: "exos" }} />
      <Row icon="⮂" label="Flashcards à réviser" n={cards.length} target={{ view: "flashcards" }} />
      <Row icon="✓" label="Quiz de la matière" n={quiz.length} target={{ view: "quiz" }} />
      {formules.length > 0 && (
        <Row icon="∑" label="Formules liées" n={formules.length} target={{ view: "formules", subject: sub }} />
      )}
      <Row icon="▶" label="Vidéos liées" n={videos.length} target={{ view: "videos", subject: sub }} />
      {annales.length > 0 && (
        <Row icon="★" label="Annales liées" n={annales.length} target={{ view: "training", subject: sub }} />
      )}
      <Row icon="▤" label="Documents du cours" n={docs.length} target={{ view: "documents" }} />
    </div>
  );
}

/* ================== CALCULS DE PROGRESSION ================== */

function subjectStats(subjectId, progress) {
  const fiches = ALL_FICHES.filter((f) => f.subject === subjectId);
  const exos = EXOS.filter((e) => e.subject === subjectId);
  const quizzes = QUIZZES.filter((q) => q.subject === subjectId);
  const cards = FLASHCARDS.filter((c) => c.subject === subjectId);
  const sujets = SUJETS.filter((s) => s.subject === subjectId);

  const fichesLues = fiches.filter((f) => (progress.fiches || []).includes(f.id)).length;
  const exosFaits = exos.filter((e) => (progress.exos || []).includes(e.id)).length;
  const quizFaits = quizzes.filter((q) => (progress.quiz || {})[q.id] != null);
  const quizAvg = quizFaits.length
    ? Math.round(quizFaits.reduce((s, q) => s + (progress.quiz[q.id].pct || 0), 0) / quizFaits.length)
    : 0;
  const cartesSues = cards.filter((c) => (progress.cards || {})[c.id] === "ok").length;
  const partielsFaits = sujets.filter((s) => (progress.partiels || []).includes(s.id)).length;

  const rF = fiches.length ? fichesLues / fiches.length : 0;
  const rE = exos.length ? exosFaits / exos.length : 0;
  const rC = cards.length ? cartesSues / cards.length : 0;
  const rQ = quizFaits.length ? quizAvg / 100 : 0;
  const mastery = Math.round(((rF * 0.3 + rE * 0.3 + rC * 0.2 + rQ * 0.2)) * 100);

  return {
    fiches, exos, quizzes, cards, sujets,
    fichesLues, exosFaits, quizFaits: quizFaits.length, quizAvg, cartesSues, partielsFaits,
    mastery,
  };
}

/* ================== DASHBOARD ================== */

function DashboardView({ progress, go }) {
  const stats = SUBJECTS.map((s) => ({ s, st: subjectStats(s.id, progress) }));
  const weakest = [...stats].sort((a, b) => a.st.mastery - b.st.mastery)[0];
  const earned = BADGES.filter((b) => b.check(progress));

  // recommandations
  const nextFiche = weakest.st.fiches.find((f) => !(progress.fiches || []).includes(f.id));
  const nextExo = weakest.st.exos.find((e) => !(progress.exos || []).includes(e.id));
  const nextSujet = weakest.st.sujets.find((s) => !(progress.partiels || []).includes(s.id));
  const nextQuiz = weakest.st.quizzes.find((q) => !((progress.quiz || {})[q.id]));

  const totalFiches = (progress.fiches || []).length;
  const totalExos = (progress.exos || []).length;
  const totalPartiels = (progress.partiels || []).length;
  const totalCards = Object.values(progress.cards || {}).filter((v) => v === "ok").length;
  const toReview = Object.values(progress.cards || {}).filter((v) => v === "revoir").length;
  const quizDone = Object.values(progress.quiz || {});
  const quizOk = quizDone.filter((q) => (q.pct || 0) >= 50).length;
  const quizKo = quizDone.length - quizOk;

  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(21), marginBottom: 3 }}>Dashboard</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 15 }}>
        Ta progression en temps réel et ce qu'il faut réviser maintenant.
      </p>

      {/* recommandation principale */}
      <div style={{
        background: `linear-gradient(130deg, ${weakest.s.color}22, ${T.bg2})`,
        border: `1px solid ${weakest.s.color}66`, borderRadius: 14, padding: "16px 16px", marginBottom: 14,
      }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1.5, color: weakest.s.color, marginBottom: 6 }}>
          ⚡ QUOI RÉVISER MAINTENANT
        </div>
        <div style={{ fontSize: 14.5, color: T.txt, lineHeight: 1.55, fontWeight: 600 }}>
          Ta matière la plus faible est <span style={{ color: weakest.s.color }}>{weakest.s.name}</span> ({weakest.st.mastery}% de maîtrise).
        </div>
        <p style={{ fontSize: 12.7, color: T.dim, lineHeight: 1.55, margin: "6px 0 11px" }}>
          {nextFiche
            ? `Commence par lire la fiche « ${nextFiche.title} », puis enchaîne avec un exercice.`
            : "Tu as lu toutes les fiches : entraîne-toi avec les exercices et un partiel blanc."}
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => go({ view: "subject", id: weakest.s.id })} style={primBtn(weakest.s.color)}>
            Réviser {weakest.s.name}
          </button>
          {nextSujet && (
            <button onClick={() => go({ view: "partielblanc" })} style={ghostBtn()}>
              ⏱ Partiel blanc conseillé
            </button>
          )}
        </div>
      </div>

      {/* progression par matière */}
      <SectionLabel>Progression par matière</SectionLabel>
      <div style={{ ...panelSt(), padding: "13px 15px" }}>
        {stats.map(({ s, st }, i) => (
          <div key={s.id} onClick={() => go({ view: "subject", id: s.id })}
            style={{ cursor: "pointer", padding: "8px 0", borderBottom: i < 3 ? `1px solid ${T.line}` : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, fontWeight: 700, color: T.txt }}>
                {s.name}
              </span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: s.color }}>
                {st.mastery}%
              </span>
            </div>
            <div style={{ height: 7, background: T.bg3, borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${st.mastery}%`, height: "100%", background: s.color, transition: "width 0.6s" }} />
            </div>
            <div style={{ fontSize: 10.5, color: T.faint, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>
              {st.fichesLues}/{st.fiches.length} fiches · {st.exosFaits}/{st.exos.length} exos · {st.cartesSues}/{st.cards.length} cartes · {st.partielsFaits} partiels
            </div>
          </div>
        ))}
      </div>

      {/* chiffres clés */}
      <SectionLabel>Tes chiffres</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(110px,1fr))", gap: 9, marginBottom: 16 }}>
        {[
          { v: `${totalFiches}/${ALL_FICHES.length}`, l: "fiches lues", c: T.cyan },
          { v: `${totalCards}`, l: "cartes sues", c: T.green },
          { v: `${toReview}`, l: "cartes à revoir", c: T.coral },
          { v: `${quizOk}`, l: "quiz réussis", c: T.green },
          { v: `${quizKo}`, l: "quiz ratés", c: T.coral },
          { v: `${totalExos}/${EXOS.length}`, l: "exos faits", c: T.amber },
          { v: `${totalPartiels}`, l: "partiels finis", c: T.pink },
          { v: `${earned.length}/${BADGES.length}`, l: "badges", c: T.yellow },
        ].map((k, i) => (
          <div key={i} style={{
            background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 11, padding: "11px 8px", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 800, color: k.c }}>{k.v}</div>
            <div style={{ fontSize: 10, color: T.dim, marginTop: 2 }}>{k.l}</div>
          </div>
        ))}
      </div>

      {/* prochaines actions conseillées */}
      <SectionLabel>Conseillé pour toi</SectionLabel>
      <div style={{ marginBottom: 16 }}>
        {nextExo && (
          <RecoRow color={T.amber} kind="PROCHAIN EXERCICE" title={nextExo.title}
            sub={`${subjectById(nextExo.subject).name} · ${nextExo.temps}`}
            onClick={() => go({ view: "exos" })} />
        )}
        {nextQuiz && (
          <RecoRow color={T.cyan} kind="PROCHAIN QUIZ" title={nextQuiz.title}
            sub={`${nextQuiz.questions.length} questions`}
            onClick={() => go({ view: "quiz" })} />
        )}
        {nextSujet && (
          <RecoRow color={T.pink} kind="PROCHAIN PARTIEL BLANC" title={nextSujet.title}
            sub={`${subjectById(nextSujet.subject).name} · ${nextSujet.duration} min`}
            onClick={() => go({ view: "partielblanc" })} />
        )}
      </div>

      {/* badges */}
      <SectionLabel>Badges — {earned.length}/{BADGES.length} débloqués</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 9 }}>
        {BADGES.map((b) => {
          const got = b.check(progress);
          return (
            <div key={b.id} style={{
              background: got ? `${T.yellow}14` : T.bg2,
              border: `1px solid ${got ? T.yellow + "66" : T.line}`, borderRadius: 11,
              padding: "11px 12px", opacity: got ? 1 : 0.55,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 17, filter: got ? "none" : "grayscale(1)" }}>{b.icon}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: got ? T.yellow : T.dim }}>
                  {b.nom}
                </span>
              </div>
              <div style={{ fontSize: 11, color: T.dim, lineHeight: 1.45, marginTop: 4 }}>{b.desc}</div>
              <div style={{ fontSize: 9.5, color: got ? T.green : T.faint, fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
                {got ? "✓ débloqué" : "verrouillé"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RecoRow({ color, kind, title, sub, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: T.bg2, border: `1px solid ${T.line}`, borderLeft: `3px solid ${color}`,
      borderRadius: 10, padding: "10px 13px", marginBottom: 7, cursor: "pointer",
      display: "flex", alignItems: "center", gap: 10,
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color, letterSpacing: 0.8 }}>{kind}</div>
        <div style={{ fontSize: 13, color: T.txt, fontWeight: 600, marginTop: 2 }}>{title}</div>
        <div style={{ fontSize: 11, color: T.dim, marginTop: 1 }}>{sub}</div>
      </div>
      <span style={{ color: T.faint, fontSize: 16 }}>›</span>
    </div>
  );
}

/* ================== PARCOURS DE RÉVISION ================== */

const PARCOURS_LISTE = [
  { id: "p30", titre: "Réviser en 30 minutes", desc: "L'essentiel vital avant de partir.", duree: "30 min", color: T.coral,
    steps: [
      { t: "Lire 2 fiches clés", d: "La matière la plus faible : 2 fiches en diagonale.", go: { view: "dashboard" } },
      { t: "Flashcards formules", d: "Passer les cartes de type Formule, toutes matières.", go: { view: "flashcards" } },
      { t: "1 quiz éclair", d: "Un quiz rapide pour tester ses réflexes.", go: { view: "quiz" } },
    ]},
  { id: "p60", titre: "Réviser en 1 heure", desc: "Une vraie session ciblée.", duree: "1 h", color: T.amber,
    steps: [
      { t: "Lire les fiches d'une matière", d: "Choisir la matière du prochain partiel.", go: { view: "dashboard" } },
      { t: "Méthodes types", d: "Revoir comment reconnaître les exercices.", go: { view: "methodes" } },
      { t: "2 exercices corrigés", d: "S'entraîner avec méthode puis correction.", go: { view: "exos" } },
      { t: "1 quiz de la matière", d: "Vérifier ses acquis.", go: { view: "quiz" } },
    ]},
  { id: "p120", titre: "Réviser en 2 heures", desc: "Session complète, type pré-partiel.", duree: "2 h", color: T.cyan,
    steps: [
      { t: "Toutes les fiches d'une matière", d: "Lecture active, marquer « à revoir ».", go: { view: "dashboard" } },
      { t: "Erreurs fréquentes", d: "Lire les pièges de la matière.", go: { view: "erreurs" } },
      { t: "3 à 4 exercices", d: "Du facile au niveau partiel.", go: { view: "exos" } },
      { t: "Flashcards de la matière", d: "Tout passer, mode aléatoire.", go: { view: "flashcards" } },
      { t: "Un partiel blanc chronométré", d: "En conditions réelles.", go: { view: "partielblanc" } },
    ]},
  { id: "pveille", titre: "Réviser la veille du partiel", desc: "Consolider, ne pas paniquer.", duree: "1 h 30", color: T.pink,
    steps: [
      { t: "Relire seulement les fiches « à revoir »", d: "Pas tout : ce qui coince.", go: { view: "dashboard" } },
      { t: "Erreurs fréquentes de la matière", d: "Pour ne pas tomber dans les pièges.", go: { view: "erreurs" } },
      { t: "Flashcards à revoir", d: "Seulement les cartes marquées « à revoir ».", go: { view: "flashcards" } },
      { t: "Un partiel blanc", d: "Se mettre en condition une dernière fois.", go: { view: "partielblanc" } },
      { t: "Dormir", d: "Sérieusement. Le sommeil consolide la mémoire.", go: null },
    ]},
  { id: "pzero", titre: "Réviser depuis zéro", desc: "Tu n'as rien suivi ? On reprend tout.", duree: "variable", color: T.violet,
    steps: [
      { t: "Mode « je comprends rien »", d: "Les notions expliquées très simplement.", go: { view: "debutant" } },
      { t: "Regarder des vidéos de cours", d: "Une vidéo explique souvent mieux qu'un texte.", go: { view: "videos" } },
      { t: "Lire les fiches dans l'ordre", d: "Matière par matière, sans sauter.", go: { view: "home" } },
      { t: "Méthodes types", d: "Comment aborder chaque type d'exercice.", go: { view: "methodes" } },
      { t: "Exercices faciles d'abord", d: "Filtrer sur la difficulté « facile ».", go: { view: "exos" } },
      { t: "Quiz pour valider", d: "Un quiz par matière.", go: { view: "quiz" } },
    ]},
  { id: "pform", titre: "Réviser seulement les formules", desc: "Bachotage pur des formules.", duree: "30-45 min", color: T.green,
    steps: [
      { t: "Flashcards type Formule", d: "Filtrer les flashcards sur « Formules ».", go: { view: "flashcards" } },
      { t: "Relire les blocs de code des fiches", d: "Les encadrés contiennent les formules clés.", go: { view: "home" } },
      { t: "Quiz Maths & Élec", d: "Beaucoup de questions sur les formules.", go: { view: "quiz" } },
    ]},
  { id: "pexo", titre: "Réviser seulement avec des exercices", desc: "Apprendre par la pratique.", duree: "variable", color: T.blue,
    steps: [
      { t: "Exercices, du facile au partiel", d: "Faire la méthode AVANT de regarder la correction.", go: { view: "exos" } },
      { t: "Générer un sujet sur mesure", d: "Le générateur crée un partiel à partir des exos.", go: { view: "generateur" } },
      { t: "Un partiel blanc complet", d: "Conditions réelles, chronométré.", go: { view: "partielblanc" } },
      { t: "Revoir la fiche en cas de blocage", d: "Si un exo coince, retour à la fiche.", go: { view: "home" } },
    ]},
];

function ParcoursView({ go }) {
  const [open, setOpen] = useState(null);
  if (open) {
    const p = PARCOURS_LISTE.find((x) => x.id === open);
    return (
      <div>
        <BackBar onBack={() => setOpen(null)} label="Tous les parcours" />
        <div style={{ borderLeft: `3px solid ${p.color}`, paddingLeft: 13, marginBottom: 14 }}>
          <h2 style={titleSt(19)}>{p.titre}</h2>
          <div style={{ fontSize: 12, color: p.color, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>⏱ {p.duree}</div>
          <p style={{ fontSize: 12.7, color: T.dim, margin: "6px 0 0" }}>{p.desc}</p>
        </div>
        {p.steps.map((st, i) => (
          <div key={i} onClick={() => st.go && go(st.go)}
            style={{
              background: T.bg2, border: `1px solid ${T.line}`, borderLeft: `3px solid ${p.color}`,
              borderRadius: 11, padding: "12px 14px", marginBottom: 8,
              cursor: st.go ? "pointer" : "default", display: "flex", alignItems: "center", gap: 12,
            }}>
            <div style={{
              width: 26, height: 26, borderRadius: 8, flexShrink: 0, background: `${p.color}1e`,
              border: `1px solid ${p.color}55`, display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 800, color: p.color,
            }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.2, color: T.txt, fontWeight: 600 }}>{st.t}</div>
              <div style={{ fontSize: 11.7, color: T.dim, marginTop: 1 }}>{st.d}</div>
            </div>
            {st.go && <span style={{ color: T.faint, fontSize: 15 }}>›</span>}
          </div>
        ))}
      </div>
    );
  }
  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Parcours de révision</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 14 }}>
        Choisis ta situation : chaque parcours est une liste d'étapes prête à suivre.
      </p>
      {PARCOURS_LISTE.map((p) => (
        <div key={p.id} onClick={() => setOpen(p.id)}
          style={{
            background: T.bg2, border: `1px solid ${T.line}`, borderLeft: `3px solid ${p.color}`,
            borderRadius: 11, padding: "13px 15px", marginBottom: 8, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 11,
          }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13.3, fontWeight: 700, color: T.txt }}>{p.titre}</div>
            <div style={{ fontSize: 11.7, color: T.dim, marginTop: 2 }}>{p.desc}</div>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.color }}>{p.duree}</span>
          <span style={{ color: T.faint, fontSize: 16 }}>›</span>
        </div>
      ))}
    </div>
  );
}

/* ================== MODE DÉBUTANT ================== */

function DebutantView({ go }) {
  const [subj, setSubj] = useState("all");
  const [open, setOpen] = useState(null);
  const filtered = subj === "all" ? DEBUTANT : DEBUTANT.filter((d) => d.subject === subj);

  if (open) {
    const d = DEBUTANT.find((x) => x.id === open);
    const sj = subjectById(d.subject);
    return <DebutantCard d={d} sj={sj} back={() => setOpen(null)} go={go} />;
  }

  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Je comprends rien</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 13 }}>
        Les notions de base expliquées le plus simplement possible, avec une analogie et un exemple.
      </p>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 14 }}>
        <button onClick={() => setSubj("all")} style={chip(T.txt, subj === "all")}>Tout</button>
        {SUBJECTS.map((s) => (
          <button key={s.id} onClick={() => setSubj(s.id)} style={chip(s.color, subj === s.id)}>{s.name}</button>
        ))}
      </div>
      {filtered.map((d) => {
        const sj = subjectById(d.subject);
        return (
          <div key={d.id} onClick={() => setOpen(d.id)}
            style={{
              background: T.bg2, border: `1px solid ${T.line}`, borderLeft: `3px solid ${sj.color}`,
              borderRadius: 11, padding: "12px 14px", marginBottom: 8, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 10,
            }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, color: T.txt, fontWeight: 600 }}>{d.titre}</div>
              <div style={{ fontSize: 11, color: sj.color, fontFamily: "'JetBrains Mono', monospace", marginTop: 2 }}>{sj.name}</div>
            </div>
            <span style={{ color: T.faint, fontSize: 16 }}>›</span>
          </div>
        );
      })}
    </div>
  );
}

function DebutantCard({ d, sj, back, go }) {
  const [showQ, setShowQ] = useState(false);
  const [picked, setPicked] = useState(null);
  const topRef = useRef(null);
  useEffect(() => { if (topRef.current) topRef.current.scrollIntoView({ block: "start" }); }, []);
  return (
    <div ref={topRef}>
      <BackBar onBack={back} label="Toutes les notions" />
      <div style={{ borderLeft: `3px solid ${sj.color}`, paddingLeft: 13, marginBottom: 14 }}>
        <div style={{ fontSize: 11, color: sj.color, fontFamily: "'JetBrains Mono', monospace" }}>{sj.name}</div>
        <h2 style={{ ...titleSt(20), marginTop: 3 }}>{d.titre}</h2>
      </div>

      <div style={panelSt()}>
        <PanelLabel color={sj.color}>En simple</PanelLabel>
        <p style={{ fontSize: 14, color: T.txt, lineHeight: 1.7, margin: 0 }}>{d.simple}</p>
      </div>
      <Callout kind="info" title="Une analogie">{d.analogie}</Callout>
      <div style={panelSt()}>
        <PanelLabel color={T.cyan}>Un exemple</PanelLabel>
        <CodeBlock code={d.exemple} color={sj.color} />
      </div>
      <Callout kind="warn" title="L'erreur classique">{d.erreur}</Callout>

      <div style={panelSt()}>
        <PanelLabel color={T.green}>Mini-question</PanelLabel>
        <div style={{ fontSize: 13.5, color: T.txt, fontWeight: 600, marginBottom: 9 }}>{d.miniQ.q}</div>
        {d.miniQ.o.map((opt, i) => {
          let bg = T.bg3, bd = T.line, col = T.txt;
          if (picked != null) {
            if (i === d.miniQ.a) { bg = "rgba(95,207,142,0.16)"; bd = T.green; col = T.green; }
            else if (i === picked) { bg = "rgba(236,106,94,0.16)"; bd = T.coral; col = T.coral; }
          }
          return (
            <button key={i} onClick={() => picked == null && setPicked(i)} disabled={picked != null}
              style={{
                display: "block", width: "100%", textAlign: "left", background: bg,
                border: `1px solid ${bd}`, borderRadius: 9, padding: "9px 12px", margin: "5px 0",
                cursor: picked == null ? "pointer" : "default", color: col, fontSize: 13,
                fontFamily: "'Spectral', serif",
              }}>{opt}</button>
          );
        })}
        {picked != null && (
          <div style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.55, marginTop: 8 }}>
            {picked === d.miniQ.a ? "✓ Bravo. " : "✗ Pas tout à fait. "}{d.miniQ.e}
          </div>
        )}
      </div>

      <div style={panelSt()}>
        <PanelLabel color={T.coral}>Pour aller plus loin</PanelLabel>
        <p style={{ fontSize: 12.3, color: T.dim, lineHeight: 1.5, margin: "0 0 9px" }}>
          Une vidéo explique souvent mieux qu'un texte. Regarde une ressource vidéo sur {sj.name}.
        </p>
        <button onClick={() => go({ view: "videos", subject: d.subject })} style={primBtn(sj.color)}>
          ▶ Voir des vidéos
        </button>
      </div>
    </div>
  );
}

/* ================== ERREURS FRÉQUENTES ================== */

function ErreursView({ go }) {
  const [subj, setSubj] = useState("info");
  const data = ERREURS.find((e) => e.subject === subj);
  const sj = subjectById(subj);
  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Erreurs fréquentes</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 13 }}>
        Les pièges qui coûtent le plus de points — et comment les éviter.
      </p>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 14 }}>
        {SUBJECTS.map((s) => (
          <button key={s.id} onClick={() => setSubj(s.id)} style={chip(s.color, subj === s.id)}>{s.name}</button>
        ))}
      </div>
      {data.items.map((it, i) => (
        <div key={i} style={{
          background: T.bg2, border: `1px solid ${T.line}`, borderLeft: `3px solid ${T.coral}`,
          borderRadius: 11, padding: "12px 14px", marginBottom: 9,
        }}>
          <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
            <span style={{ color: T.coral, fontSize: 14, fontWeight: 700 }}>✗</span>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: T.txt }}>{it.titre}</div>
          </div>
          <p style={{ fontSize: 12.7, color: T.dim, lineHeight: 1.6, margin: "6px 0 8px" }}>{it.exp}</p>
          <div style={{
            background: "rgba(95,207,142,0.08)", border: `1px solid ${T.green}33`,
            borderRadius: 8, padding: "8px 11px",
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.green, fontWeight: 700 }}>✓ LE BON RÉFLEXE  </span>
            <span style={{ fontSize: 12.5, color: T.txt, lineHeight: 1.55 }}>{it.fix}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ================== MÉTHODES TYPES ================== */

function MethodesView({ go }) {
  const [subj, setSubj] = useState("info");
  const data = METHODES.find((m) => m.subject === subj);
  const sj = subjectById(subj);
  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Méthodes types</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 13 }}>
        Comment reconnaître chaque type d'exercice et la démarche pour le résoudre.
      </p>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 14 }}>
        {SUBJECTS.map((s) => (
          <button key={s.id} onClick={() => setSubj(s.id)} style={chip(s.color, subj === s.id)}>{s.name}</button>
        ))}
      </div>
      {data.items.map((it, i) => (
        <div key={i} style={{ ...panelSt() }}>
          <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 5 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: sj.color, fontWeight: 700 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13.5, fontWeight: 700, color: T.txt }}>{it.titre}</div>
          </div>
          <div style={{
            background: `${sj.color}12`, border: `1px solid ${sj.color}33`, borderRadius: 8,
            padding: "7px 11px", marginBottom: 8,
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: sj.color, fontWeight: 700 }}>COMMENT LE RECONNAÎTRE  </span>
            <span style={{ fontSize: 12.5, color: T.txt, lineHeight: 1.5 }}>{it.reconnaitre}</span>
          </div>
          <ol style={{ margin: 0, paddingLeft: 19 }}>
            {it.etapes.map((e, j) => (
              <li key={j} style={{ fontSize: 12.8, color: T.txt, lineHeight: 1.6, margin: "3px 0" }}>{e}</li>
            ))}
          </ol>
        </div>
      ))}

      <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${T.line}` }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: T.faint, marginBottom: 8, letterSpacing: 1 }}>
          GUIDES DÉTAILLÉS — RECONNAÎTRE L'EXERCICE
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => go({ view: "reconnaitreinfo" })} style={primBtn(T.cyan)}>
            ▶ Informatique
          </button>
          <button onClick={() => go({ view: "reconnaitreelec" })} style={primBtn(T.green)}>
            ▶ Électronique
          </button>
        </div>
      </div>
    </div>
  );
}

function GenerateurView({ progress, handlers, go }) {
  const [subj, setSubj] = useState("info");
  const [duree, setDuree] = useState(60);
  const [diff, setDiff] = useState("mixte");
  const [nb, setNb] = useState(3);
  const [tags, setTags] = useState([]);
  const [sujet, setSujet] = useState(null);

  const sj = subjectById(subj);
  const pool = EXOS.filter((e) => e.subject === subj);
  const allTags = [...new Set(pool.flatMap((e) => e.tags))];

  function toggleTag(t) {
    setTags((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  }

  function generer() {
    let cand = pool.filter((e) => diff === "mixte" || e.difficulty === diff);
    if (tags.length) cand = cand.filter((e) => e.tags.some((t) => tags.includes(t)));
    if (cand.length === 0) cand = pool;   // repli
    // mélange
    const shuffled = [...cand];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const choisis = shuffled.slice(0, Math.min(nb, shuffled.length));
    const ptsBase = Math.floor(20 / choisis.length);
    const items = choisis.map((e, i) => ({
      n: `Ex. ${i + 1}`,
      pts: `${i === choisis.length - 1 ? 20 - ptsBase * (choisis.length - 1) : ptsBase} pts`,
      q: e.enonce, indice: e.indice, c: e.correction,
    }));
    const chapTags = [...new Set(choisis.flatMap((e) => e.tags))];
    setSujet({
      id: "gen-" + Date.now(), subject: subj, level: diff === "mixte" ? "normal" : diff,
      duration: duree, bareme: 20,
      title: `Sujet généré · ${sj.name}`,
      tags: chapTags,
      parts: [{ title: `Sujet généré — ${choisis.length} exercices · ${duree} min`, items }],
      conseils: [
        "Gère ton temps : répartis la durée entre les exercices selon le barème.",
        "Lis la méthode avant de regarder la correction.",
        "Note les exercices où tu as bloqué pour y revenir.",
      ],
      erreurs: ERREURS.find((x) => x.subject === subj).items.slice(0, 3).map((x) => x.titre),
    });
  }

  if (sujet) {
    return <TrainingRunner sujet={sujet} timed={true} back={() => setSujet(null)} onQuit={() => setSujet(null)}
      onComplete={() => handlers.markPartiel(sujet.id)} />;
  }

  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Générer un sujet</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 15 }}>
        Crée un partiel sur mesure à partir de la banque d'exercices. Chronométré, avec correction et bilan.
      </p>

      <SectionLabel>Matière</SectionLabel>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 12 }}>
        {SUBJECTS.map((s) => (
          <button key={s.id} onClick={() => { setSubj(s.id); setTags([]); }} style={chip(s.color, subj === s.id)}>{s.name}</button>
        ))}
      </div>

      <SectionLabel>Durée</SectionLabel>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {[{ v: 30, l: "30 min" }, { v: 60, l: "1 h" }, { v: 90, l: "1 h 30" }, { v: 120, l: "2 h" }].map((o) => (
          <button key={o.v} onClick={() => setDuree(o.v)} style={chip(T.amber, duree === o.v)}>{o.l}</button>
        ))}
      </div>

      <SectionLabel>Difficulté</SectionLabel>
      <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
        {[{ v: "mixte", l: "Mixte" }, { v: "facile", l: "Facile" }, { v: "moyen", l: "Moyen" }, { v: "partiel", l: "Niveau partiel" }].map((o) => (
          <button key={o.v} onClick={() => setDiff(o.v)} style={chip(T.coral, diff === o.v)}>{o.l}</button>
        ))}
      </div>

      <SectionLabel>Nombre d'exercices</SectionLabel>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {[2, 3, 4, 5].map((n) => (
          <button key={n} onClick={() => setNb(n)} style={chip(T.cyan, nb === n)}>{n}</button>
        ))}
      </div>

      <SectionLabel>Chapitres (optionnel — sinon tous)</SectionLabel>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
        {allTags.map((t) => (
          <button key={t} onClick={() => toggleTag(t)} style={chip(sj.color, tags.includes(t))}>#{t}</button>
        ))}
      </div>

      <button onClick={generer} style={{ ...primBtn(sj.color), width: "100%", padding: "13px" }}>
        ⚙ Générer le sujet
      </button>
      <p style={{ fontSize: 11, color: T.faint, marginTop: 9, textAlign: "center" }}>
        {pool.length} exercices disponibles en {sj.name}. Chaque génération mélange la sélection.
      </p>
    </div>
  );
}

/* ================== CE QUI TOMBE SOUVENT ================== */

function TombeView({ go }) {
  const [subj, setSubj] = useState("info");
  const data = TOMBE.find((t) => t.subject === subj);
  const sj = subjectById(subj);

  const Bloc = ({ label, color, items, icon }) => (
    <div style={panelSt()}>
      <PanelLabel color={color}>{icon} {label}</PanelLabel>
      <ul style={{ margin: 0, paddingLeft: 4, listStyle: "none" }}>
        {items.map((it, i) => (
          <li key={i} style={{
            fontSize: 12.8, color: T.txt, lineHeight: 1.6, margin: "5px 0",
            paddingLeft: 18, position: "relative",
          }}>
            <span style={{ position: "absolute", left: 0, color }}>›</span>{it}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Ce qui tombe souvent</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 13 }}>
        Analyse des partiels et TD du zip : les chapitres, exercices et pièges récurrents en examen.
      </p>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 14 }}>
        {SUBJECTS.map((s) => (
          <button key={s.id} onClick={() => setSubj(s.id)} style={chip(s.color, subj === s.id)}>{s.name}</button>
        ))}
      </div>

      <Bloc label="Chapitres les plus fréquents" color={sj.color} icon="◆" items={data.chapitres} />
      <Bloc label="Types d'exercices récurrents" color={T.cyan} icon="✎" items={data.exos} />
      <Bloc label="Pièges classiques" color={T.coral} icon="✗" items={data.pieges} />
      <Bloc label="Formules à connaître" color={T.yellow} icon="∑" items={data.formules} />
      <Bloc label="Méthodes à maîtriser" color={T.green} icon="◎" items={data.methodes} />

      {data.fiches && (
        <div style={panelSt()}>
          <PanelLabel color={T.violet}>▣ Fiches à revoir en priorité</PanelLabel>
          {data.fiches.map((id) => {
            const f = ALL_FICHES.find((fi) => fi.id === id);
            if (!f) return null;
            return (
              <div key={id} onClick={() => go({ view: "subject", id: f.subject, fiche: f.id })}
                style={{
                  background: T.bg3, border: `1px solid ${T.line}`, borderRadius: 9,
                  padding: "9px 12px", marginBottom: 6, cursor: "pointer",
                  display: "flex", alignItems: "center", gap: 9,
                }}>
                <span style={{ color: T.violet, fontSize: 13 }}>▣</span>
                <span style={{ flex: 1, fontSize: 12.7, color: T.txt, fontWeight: 600 }}>{f.title}</span>
                <span style={{ color: T.faint, fontSize: 14 }}>›</span>
              </div>
            );
          })}
        </div>
      )}

      <div style={panelSt()}>
        <PanelLabel color={T.amber}>★ Exercices prioritaires à faire</PanelLabel>
        {data.prioritaires.map((id) => {
          const ex = EXOS.find((e) => e.id === id);
          if (!ex) return null;
          return (
            <div key={id} onClick={() => go({ view: "exos" })}
              style={{
                background: T.bg3, border: `1px solid ${T.line}`, borderRadius: 9,
                padding: "9px 12px", marginBottom: 6, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 9,
              }}>
              <span style={{ color: T.amber, fontSize: 13 }}>✎</span>
              <span style={{ flex: 1, fontSize: 12.7, color: T.txt, fontWeight: 600 }}>{ex.title}</span>
              <span style={{ color: T.faint, fontSize: 14 }}>›</span>
            </div>
          );
        })}
      </div>

      <button onClick={() => go({ view: "subject", id: subj })} style={{ ...primBtn(sj.color), width: "100%" }}>
        Réviser {sj.name}
      </button>
    </div>
  );
}

/* ================== MÉTHODES DE PARTIEL ================== */

function MethodesPartielView({ go }) {
  const [subj, setSubj] = useState("general");
  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Méthodes de partiel</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 13 }}>
        Comment réviser, lire un énoncé, gérer son temps et présenter une copie — sans perdre de points bêtement.
      </p>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 14 }}>
        <button onClick={() => setSubj("general")} style={chip(T.txt, subj === "general")}>Général</button>
        {SUBJECTS.map((s) => (
          <button key={s.id} onClick={() => setSubj(s.id)} style={chip(s.color, subj === s.id)}>{s.name}</button>
        ))}
      </div>

      {subj === "general" && METHODES_PARTIEL_GENERAL.map((m, i) => (
        <div key={i} style={panelSt()}>
          <PanelLabel color={T.amber}>{m.titre}</PanelLabel>
          <ul style={{ margin: 0, paddingLeft: 4, listStyle: "none" }}>
            {m.points.map((p, j) => (
              <li key={j} style={{
                fontSize: 12.8, color: T.txt, lineHeight: 1.6, margin: "5px 0",
                paddingLeft: 18, position: "relative",
              }}>
                <span style={{ position: "absolute", left: 0, color: T.amber }}>›</span>{p}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {subj !== "general" && (() => {
        const sj = subjectById(subj);
        const data = METHODES_PARTIEL_SUBJECT.find((m) => m.subject === subj);
        return (
          <div>
            <div style={panelSt()}>
              <PanelLabel color={sj.color}>Méthode partiel — {sj.name}</PanelLabel>
              <ul style={{ margin: 0, paddingLeft: 4, listStyle: "none" }}>
                {data.conseils.map((c, j) => (
                  <li key={j} style={{
                    fontSize: 12.8, color: T.txt, lineHeight: 1.6, margin: "6px 0",
                    paddingLeft: 18, position: "relative",
                  }}>
                    <span style={{ position: "absolute", left: 0, color: sj.color, fontWeight: 700 }}>›</span>{c}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button onClick={() => go({ view: "methodes" })} style={ghostBtn()}>◎ Méthodes types</button>
              <button onClick={() => go({ view: "erreurs" })} style={ghostBtn()}>✗ Erreurs fréquentes</button>
              <button onClick={() => go({ view: "tombe" })} style={primBtn(sj.color)}>Ce qui tombe souvent</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ================== BIBLIOTHÈQUE DE DOCUMENTS ================== */

function DocumentsView({ go }) {
  const [subj, setSubj] = useState("all");
  const [type, setType] = useState("all");
  const [imp, setImp] = useState("all");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(null);

  if (open) {
    const doc = DOCS.find((d) => d.name === open);
    return <DocReader doc={doc} back={() => setOpen(null)} go={go} />;
  }

  const types = ["all", "Cours", "Fiche", "TD", "TP", "Partiel", "Correction"];
  const imps = ["all", "essentiel", "utile", "bonus"];
  const ql = q.toLowerCase();
  const filtered = DOCS.filter((d) =>
    (subj === "all" || d.subject === subj) &&
    (type === "all" || d.type === type) &&
    (imp === "all" || d.importance === imp) &&
    (ql === "" || (d.name + " " + d.resume + " " + (d.detail || "")).toLowerCase().includes(ql))
  );
  const impColor = { essentiel: T.coral, utile: T.amber, bonus: T.faint };

  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Bibliothèque de cours</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 12 }}>
        Tous les documents du zip — {DOCS.length} fichiers. Filtre, cherche, et clique pour le détail.
      </p>

      <input
        value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Rechercher un document…"
        style={{
          width: "100%", background: T.bg2, border: `1px solid ${T.line}`,
          borderRadius: 10, padding: "10px 13px", color: T.txt, fontSize: 13,
          fontFamily: "'Spectral', serif", outline: "none", marginBottom: 10,
        }}
      />
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 7 }}>
        <button onClick={() => setSubj("all")} style={chip(T.txt, subj === "all")}>Toutes matières</button>
        {SUBJECTS.map((s) => (
          <button key={s.id} onClick={() => setSubj(s.id)} style={chip(s.color, subj === s.id)}>{s.name}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 7 }}>
        {types.map((t) => (
          <button key={t} onClick={() => setType(t)} style={chip(T.cyan, type === t)}>
            {t === "all" ? "Tous types" : t}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 13 }}>
        {imps.map((m) => (
          <button key={m} onClick={() => setImp(m)} style={chip(T.coral, imp === m)}>
            {m === "all" ? "Toute importance" : m}
          </button>
        ))}
      </div>

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: T.faint, marginBottom: 8 }}>
        {filtered.length} document{filtered.length !== 1 ? "s" : ""}
      </div>
      {filtered.length === 0 && (
        <div style={{ color: T.dim, fontSize: 13, padding: 14 }}>Aucun document pour ces filtres.</div>
      )}
      {filtered.map((d, i) => {
        const sj = subjectById(d.subject);
        return (
          <div key={i} onClick={() => setOpen(d.name)}
            style={{
              background: T.bg2, border: `1px solid ${T.line}`, borderLeft: `3px solid ${sj.color}`,
              borderRadius: 10, padding: "11px 13px", marginBottom: 7, cursor: "pointer",
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
              <div style={{ fontSize: 13, color: T.txt, fontWeight: 600 }}>{d.name}</div>
              <div style={{ display: "flex", gap: 5, alignItems: "center", flexShrink: 0 }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700,
                  color: impColor[d.importance], border: `1px solid ${impColor[d.importance]}66`,
                  borderRadius: 5, padding: "2px 6px", textTransform: "uppercase",
                }}>{d.importance}</span>
                <span style={{ color: T.faint, fontSize: 15 }}>›</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 3 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: sj.color }}>
                {sj.name.toUpperCase()} · {d.type}
              </span>
            </div>
            <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.5, marginTop: 4 }}>{d.resume}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ================== RÉVISER UNE ANNALE ================== */

function ReviserAnnaleView({ progress, handlers, go }) {
  const [sel, setSel] = useState(null);
  const [exam, setExam] = useState(false);

  if (sel && exam) {
    const a = ANNALES.find((x) => x.id === sel);
    return <TrainingRunner sujet={a} timed={true} back={() => setExam(false)}
      onQuit={() => setExam(false)} onComplete={() => handlers.markPartiel(a.id)} />;
  }

  if (sel) {
    const a = ANNALES.find((x) => x.id === sel);
    const sj = subjectById(a.subject);
    const fiches = fichesOf(a.subject);
    const cards = FLASHCARDS.filter((c) => c.subject === a.subject);
    const exosSim = EXOS.filter((e) => e.subject === a.subject);
    return (
      <div>
        <BackBar onBack={() => setSel(null)} label="Toutes les annales" />
        <div style={{ borderLeft: `3px solid ${sj.color}`, paddingLeft: 13, marginBottom: 13 }}>
          <div style={{ fontSize: 11, color: sj.color, fontFamily: "'JetBrains Mono', monospace" }}>{sj.name} · vrai partiel</div>
          <h2 style={{ ...titleSt(18), marginTop: 4 }}>{a.title}</h2>
        </div>

        <div style={panelSt()}>
          <PanelLabel color={sj.color}>1 · Chapitres nécessaires</PanelLabel>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {a.tags.map((t, i) => (
              <span key={i} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: sj.color,
                background: `${sj.color}1a`, border: `1px solid ${sj.color}44`,
                borderRadius: 7, padding: "5px 10px",
              }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={panelSt()}>
          <PanelLabel color={T.cyan}>2 · Fiches à lire avant</PanelLabel>
          {fiches.slice(0, 6).map((f) => (
            <div key={f.id} onClick={() => go({ view: "subject", id: a.subject })}
              style={{
                background: T.bg3, border: `1px solid ${T.line}`, borderRadius: 8,
                padding: "8px 11px", marginBottom: 5, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}>
              <span style={{ color: T.cyan, fontSize: 12 }}>◆</span>
              <span style={{ flex: 1, fontSize: 12.5, color: T.txt }}>{f.title}</span>
              <span style={{ color: T.faint, fontSize: 13 }}>›</span>
            </div>
          ))}
        </div>

        <div style={panelSt()}>
          <PanelLabel color={T.violet}>3 · Flashcards à réviser avant</PanelLabel>
          <p style={{ fontSize: 12.5, color: T.dim, margin: "0 0 8px" }}>
            {cards.length} cartes de {sj.name} — passe-les en mode aléatoire pour t'échauffer.
          </p>
          <button onClick={() => go({ view: "flashcards" })} style={ghostBtn()}>⮂ Ouvrir les flashcards</button>
        </div>

        <div style={{
          background: `linear-gradient(130deg, ${sj.color}22, ${T.bg2})`,
          border: `1px solid ${sj.color}66`, borderRadius: 13, padding: "15px 15px", marginBottom: 11,
        }}>
          <PanelLabel color={sj.color}>4 · Faire le sujet en mode examen</PanelLabel>
          <p style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.55, margin: "0 0 10px" }}>
            Chronomètre lancé, correction masquée. À la fin : bilan des notions à retravailler.
          </p>
          <button onClick={() => setExam(true)} style={{ ...primBtn(sj.color), width: "100%" }}>
            ⏱ Lancer le partiel ({a.duration} min · /{a.bareme})
          </button>
        </div>

        <div style={panelSt()}>
          <PanelLabel color={T.amber}>5 · S'entraîner avec des exercices similaires</PanelLabel>
          {exosSim.slice(0, 5).map((e) => (
            <div key={e.id} onClick={() => go({ view: "exos" })}
              style={{
                background: T.bg3, border: `1px solid ${T.line}`, borderRadius: 8,
                padding: "8px 11px", marginBottom: 5, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}>
              <span style={{ color: T.amber, fontSize: 12 }}>✎</span>
              <span style={{ flex: 1, fontSize: 12.5, color: T.txt }}>{e.title}</span>
              <span style={{ color: T.faint, fontSize: 13 }}>›</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Réviser une annale</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 14 }}>
        Choisis un vrai partiel du zip : le site te guide étape par étape — fiches à lire, flashcards,
        sujet en mode examen, puis exercices similaires.
      </p>
      {ANNALES.map((a) => {
        const sj = subjectById(a.subject);
        const done = (progress.partiels || []).includes(a.id);
        return (
          <div key={a.id} onClick={() => setSel(a.id)}
            style={{
              background: T.bg2, border: `1px solid ${T.line}`, borderLeft: `3px solid ${sj.color}`,
              borderRadius: 11, padding: "13px 15px", marginBottom: 9, cursor: "pointer",
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: T.txt }}>{a.title}</div>
              {done && <span style={{ color: T.green, fontSize: 13 }}>✓</span>}
            </div>
            <div style={{ display: "flex", gap: 7, marginTop: 5, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 10, color: sj.color, fontFamily: "'JetBrains Mono', monospace" }}>{sj.name.toUpperCase()}</span>
              <span style={{ fontSize: 10, color: T.faint, fontFamily: "'JetBrains Mono', monospace" }}>⏱ {a.duration} min · /{a.bareme}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ================== FORMULAIRE ================== */
/* type : "formule" | "methode" | "definition" | "piege" */

const FORMULAS = [
  /* ---------- MATHÉMATIQUES ---------- */
  { id: "fo-taylor", subject: "math", chapter: "Développements limités", type: "formule",
    nom: "Formule de Taylor-Young",
    tex: "f(x) = \\sum_{k=0}^{n} \\dfrac{f^{(k)}(a)}{k!}\\,(x-a)^k + o\\!\\left((x-a)^n\\right)",
    variables: ["f⁽ᵏ⁾(a) : dérivée k-ième de f au point a", "n : ordre du développement", "o((x−a)ⁿ) : reste négligeable"],
    quand: "Pour obtenir le DL d'ordre n d'une fonction au voisinage d'un point a.",
    exemple: "En 0 : $e^{x} = 1 + x + \\dfrac{x^2}{2} + o(x^2)$",
    piege: "Ne jamais oublier le reste o((x−a)ⁿ) : sans lui, ce n'est pas un DL." },
  { id: "fo-dl-exp", subject: "math", chapter: "Développements limités", type: "formule",
    nom: "DL usuels en 0",
    tex: "e^{x} = 1 + x + \\dfrac{x^2}{2!} + \\cdots \\qquad \\ln(1+x) = x - \\dfrac{x^2}{2} + \\cdots",
    variables: ["x : variable tendant vers 0"],
    quand: "Pour lever une forme indéterminée ou approcher une fonction près de 0.",
    exemple: "$\\sin x = x - \\dfrac{x^3}{6} + o(x^3)$",
    piege: "Confondre les débuts : sin commence par x, cos par 1." },
  { id: "fo-riemann", subject: "math", chapter: "Intégrales généralisées", type: "formule",
    nom: "Intégrales de Riemann",
    tex: "\\int_{1}^{+\\infty} \\dfrac{dx}{x^{\\alpha}} \\ \\text{converge} \\iff \\alpha > 1",
    variables: ["α : exposant", "borne ∞ : à l'infini il faut α > 1 ; en 0 il faut β < 1"],
    quand: "Pour conclure la nature d'une intégrale généralisée par comparaison.",
    exemple: "$\\int_{1}^{+\\infty} \\dfrac{dx}{x^2}$ converge (α = 2 > 1).",
    piege: "Inverser le critère selon la borne : α>1 à l'infini, β<1 en 0." },
  { id: "fo-det2", subject: "math", chapter: "Déterminants", type: "formule",
    nom: "Déterminant 2×2",
    tex: "\\det\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc",
    variables: ["a, b, c, d : coefficients de la matrice"],
    quand: "Pour tester l'inversibilité d'une matrice 2×2 ou calculer une aire.",
    exemple: "$\\det\\begin{pmatrix} 2 & 1 \\\\ 3 & 4 \\end{pmatrix} = 8 - 3 = 5$",
    piege: "Oublier que c'est ad − bc, pas ab − cd." },
  { id: "fo-inv2", subject: "math", chapter: "Matrices", type: "formule",
    nom: "Inverse d'une matrice 2×2",
    tex: "A^{-1} = \\dfrac{1}{ad-bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}",
    variables: ["ad − bc : déterminant de A (doit être non nul)"],
    quand: "Pour résoudre AX = B par la méthode de l'inverse, en dimension 2.",
    exemple: "Échanger a et d, changer le signe de b et c, diviser par det.",
    piege: "Appliquer la formule si det(A) = 0 : la matrice n'est pas inversible." },
  { id: "fo-sarrus", subject: "math", chapter: "Déterminants", type: "methode",
    nom: "Règle de Sarrus (3×3)",
    tex: "\\det\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix} = aei + bfg + cdh - ceg - bdi - afh",
    variables: ["a … i : coefficients de la matrice 3×3"],
    quand: "Pour calculer rapidement un déterminant 3×3.",
    exemple: "Trois produits descendants (+), trois montants (−).",
    piege: "La règle de Sarrus ne marche QUE pour les matrices 3×3." },
  { id: "fo-equiv", subject: "math", chapter: "Équivalents", type: "piege",
    nom: "Équivalents usuels en 0",
    tex: "\\sin x \\sim x \\qquad 1-\\cos x \\sim \\dfrac{x^2}{2} \\qquad e^{x}-1 \\sim x",
    variables: ["x : variable tendant vers 0"],
    quand: "Pour simplifier un produit ou un quotient dans un calcul de limite.",
    exemple: "$\\dfrac{\\sin x}{x} \\to 1$ quand x → 0.",
    piege: "Un équivalent ne se substitue JAMAIS dans une somme." },

  /* ---------- MÉCANIQUE ---------- */
  { id: "fo-ec", subject: "meca", chapter: "Énergie cinétique", type: "formule",
    nom: "Énergie cinétique",
    tex: "E_c = \\tfrac{1}{2}\\,m\\,v^{2}",
    variables: ["m : masse (kg)", "v : vitesse (m/s)", "Ec : énergie cinétique (J)"],
    quand: "Pour tout bilan d'énergie lié au mouvement d'un solide.",
    exemple: "m = 2 kg, v = 3 m/s → $E_c = \\tfrac{1}{2}\\cdot 2 \\cdot 9 = 9$ J.",
    piege: "La vitesse est au carré : doubler v quadruple Ec." },
  { id: "fo-ep", subject: "meca", chapter: "Énergie potentielle", type: "formule",
    nom: "Énergies potentielles",
    tex: "E_p = m\\,g\\,z \\qquad E_p = \\tfrac{1}{2}\\,k\\,x^{2}",
    variables: ["m·g·z : pesanteur (z = altitude)", "½·k·x² : ressort (x = allongement)"],
    quand: "Dans un bilan énergétique avec des forces conservatives.",
    exemple: "Ressort k = 100 N/m, x = 0,1 m → $E_p = 0{,}5$ J.",
    piege: "Mal choisir l'origine de l'altitude z fausse tout le bilan." },
  { id: "fo-tec", subject: "meca", chapter: "Énergie cinétique", type: "formule",
    nom: "Théorème de l'énergie cinétique",
    tex: "\\Delta E_c = \\sum W_{\\text{forces ext}}",
    variables: ["ΔEc : variation d'énergie cinétique (J)", "W : travail des forces (J)"],
    quand: "Pour relier une variation de vitesse au travail des forces.",
    exemple: "Chute libre de hauteur h → $v = \\sqrt{2gh}$.",
    piege: "Oublier le travail des frottements (négatif)." },
  { id: "fo-tem", subject: "meca", chapter: "Énergie mécanique", type: "formule",
    nom: "Théorème de l'énergie mécanique",
    tex: "E_m = E_c + E_p \\qquad \\Delta E_m = W_{\\text{non conservatives}}",
    variables: ["Em : énergie mécanique (J)", "W : travail des forces non conservatives"],
    quand: "Pour un bilan énergétique, notamment avec frottements.",
    exemple: "Sans frottement : ΔEm = 0, l'énergie se conserve.",
    piege: "Appliquer la conservation de Em alors qu'il y a des frottements." },
  { id: "fo-pfd", subject: "meca", chapter: "PFD", type: "formule",
    nom: "Principe fondamental de la dynamique",
    tex: "\\sum \\vec{F} = m\\,\\vec{a}",
    variables: ["ΣF⃗ : somme des forces (N)", "m : masse (kg)", "a⃗ : accélération (m/s²)"],
    quand: "Pour obtenir l'accélération ou l'équation du mouvement.",
    exemple: "Masse-ressort → $m\\ddot{x} = -kx$.",
    piege: "Le référentiel doit être galiléen." },
  { id: "fo-osc", subject: "meca", chapter: "Oscillateur", type: "formule",
    nom: "Oscillateur harmonique",
    tex: "\\ddot{x} + \\omega_0^{2}\\,x = 0 \\qquad x(t) = A\\cos(\\omega_0 t + \\varphi)",
    variables: ["ω₀ : pulsation propre (rad/s)", "A : amplitude", "φ : phase à l'origine"],
    quand: "Dès qu'un système a une force de rappel proportionnelle à l'écart.",
    exemple: "A et φ se trouvent avec x(0) et ẋ(0).",
    piege: "Confondre pulsation ω et fréquence f (ω = 2πf)." },
  { id: "fo-w0", subject: "meca", chapter: "Oscillateur", type: "formule",
    nom: "Pulsation et période propres",
    tex: "\\omega_0 = \\sqrt{\\dfrac{k}{m}} \\qquad T_0 = \\dfrac{2\\pi}{\\omega_0}",
    variables: ["k : raideur (N/m)", "m : masse (kg)", "T₀ : période propre (s)"],
    quand: "Pour caractériser un oscillateur (masse-ressort, pendule).",
    exemple: "Pendule simple : $\\omega_0 = \\sqrt{g/L}$.",
    piege: "Oublier la racine carrée dans ω₀." },
  { id: "fo-amort", subject: "meca", chapter: "Amortissement", type: "formule",
    nom: "Oscillateur amorti",
    tex: "\\ddot{x} + \\dfrac{\\omega_0}{Q}\\,\\dot{x} + \\omega_0^{2}\\,x = 0",
    variables: ["Q : facteur de qualité", "ω₀ : pulsation propre"],
    quand: "Pour un oscillateur soumis à un frottement fluide.",
    exemple: "Q > ½ : régime pseudo-périodique (oscille en s'atténuant).",
    piege: "Confondre les trois régimes (pseudo-périodique / critique / apériodique)." },
  { id: "fo-trav", subject: "meca", chapter: "Travail", type: "formule",
    nom: "Travail et puissance",
    tex: "W = \\vec{F}\\cdot\\vec{AB} \\qquad P = \\vec{F}\\cdot\\vec{v}",
    variables: ["W : travail (J)", "P : puissance (W)", "F⃗ : force, v⃗ : vitesse"],
    quand: "Le travail pour une énergie, la puissance pour un débit d'énergie.",
    exemple: "Force dans le sens du mouvement → travail moteur (W > 0).",
    piege: "Confondre travail (J) et puissance (W) : P = W/Δt." },

  /* ---------- ÉLECTRONIQUE ---------- */
  { id: "fo-ohm", subject: "elec", chapter: "Lois", type: "formule",
    nom: "Loi d'Ohm",
    tex: "U = R\\,I",
    variables: ["U : tension (V)", "R : résistance (Ω)", "I : courant (A)"],
    quand: "Pour relier tension et courant aux bornes d'une résistance.",
    exemple: "R = 100 Ω, I = 0,2 A → U = 20 V.",
    piege: "Mélanger les unités (kΩ et Ω, mA et A) avant le calcul." },
  { id: "fo-assoc", subject: "elec", chapter: "Lois", type: "formule",
    nom: "Associations de résistances",
    tex: "R_{\\text{série}} = R_1 + R_2 \\qquad \\dfrac{1}{R_{\\text{//}}} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}",
    variables: ["R₁, R₂ : résistances associées"],
    quand: "Pour simplifier un circuit avant de le résoudre.",
    exemple: "Deux fois 100 Ω en parallèle → 50 Ω.",
    piege: "Inverser les formules série / parallèle." },
  { id: "fo-divtension", subject: "elec", chapter: "Diviseur", type: "formule",
    nom: "Diviseur de tension",
    tex: "U_2 = U \\cdot \\dfrac{R_2}{R_1 + R_2}",
    variables: ["U : tension totale", "U₂ : tension aux bornes de R₂"],
    quand: "Pour deux résistances en série, sans courant tiré au point milieu.",
    exemple: "R₁ = R₂ → U₂ = U/2.",
    piege: "Faux si une charge tire du courant au point milieu." },
  { id: "fo-puissance", subject: "elec", chapter: "Lois", type: "formule",
    nom: "Puissance dissipée",
    tex: "P = U\\,I = R\\,I^{2} = \\dfrac{U^{2}}{R}",
    variables: ["P : puissance (W)", "U : tension, I : courant, R : résistance"],
    quand: "Pour calculer la puissance dissipée par effet Joule.",
    exemple: "R = 10 Ω, I = 2 A → P = 40 W.",
    piege: "Oublier le carré sur I ou sur U." },
  { id: "fo-impedance", subject: "elec", chapter: "Régime sinusoïdal", type: "formule",
    nom: "Impédances complexes",
    tex: "Z_R = R \\qquad Z_L = jL\\omega \\qquad Z_C = \\dfrac{1}{jC\\omega}",
    variables: ["ω : pulsation (rad/s)", "L : inductance (H)", "C : capacité (F)"],
    quand: "En régime sinusoïdal, pour traiter bobines et condensateurs.",
    exemple: "À haute fréquence : Z_C → 0 (le condensateur passe).",
    piege: "Traiter L et C comme de simples résistances." },
  { id: "fo-conden", subject: "elec", chapter: "Condensateur", type: "formule",
    nom: "Condensateur",
    tex: "Q = C\\,U \\qquad i = C\\,\\dfrac{dU}{dt} \\qquad E = \\tfrac{1}{2}\\,C\\,U^{2}",
    variables: ["Q : charge (C)", "C : capacité (F)", "E : énergie stockée (J)"],
    quand: "Pour étudier la charge, le courant ou l'énergie d'un condensateur.",
    exemple: "C = 10 µF, U = 5 V → Q = 50 µC.",
    piege: "La tension d'un condensateur ne peut pas varier brusquement." },
  { id: "fo-tau", subject: "elec", chapter: "Régime transitoire", type: "formule",
    nom: "Constante de temps",
    tex: "\\tau = R\\,C \\qquad u(t) = E\\left(1 - e^{-t/\\tau}\\right)",
    variables: ["τ : constante de temps (s)", "E : tension finale"],
    quand: "Pour décrire la charge / décharge d'un circuit RC ou RL.",
    exemple: "À t = τ, u atteint 63 % de E.",
    piege: "Pour un RL, τ = L/R, pas R·L." },
  { id: "fo-transfert", subject: "elec", chapter: "Filtres", type: "formule",
    nom: "Fonction de transfert & gain en dB",
    tex: "H(j\\omega) = \\dfrac{U_s}{U_e} \\qquad G_{\\text{dB}} = 20\\,\\log_{10}|H|",
    variables: ["H : fonction de transfert", "G_dB : gain en décibels"],
    quand: "Pour caractériser un filtre et tracer son diagramme de Bode.",
    exemple: "|H| = 1 → G = 0 dB ; |H| = 1/√2 → G ≈ −3 dB.",
    piege: "Pour une tension, c'est 20·log₁₀, pas 10·log." },
  { id: "fo-fc", subject: "elec", chapter: "Filtres", type: "formule",
    nom: "Fréquence de coupure (RC)",
    tex: "\\omega_c = \\dfrac{1}{RC} \\qquad f_c = \\dfrac{1}{2\\pi RC}",
    variables: ["ω_c : pulsation de coupure (rad/s)", "f_c : fréquence de coupure (Hz)"],
    quand: "Pour situer la coupure d'un filtre RC du premier ordre.",
    exemple: "R = 1 kΩ, C = 1 µF → f_c ≈ 159 Hz.",
    piege: "La coupure se lit à −3 dB sur la courbe de gain, pas de phase." },
  { id: "fo-passebas", subject: "elec", chapter: "Filtres", type: "formule",
    nom: "Filtre passe-bas RC",
    tex: "H(j\\omega) = \\dfrac{1}{1 + jRC\\omega}",
    variables: ["RCω : pulsation réduite (= ω/ω_c)"],
    quand: "Pour un circuit R en série, sortie aux bornes du condensateur.",
    exemple: "BF : |H| ≈ 1 ; HF : |H| → 0 (chute à −20 dB/décade).",
    piege: "Confondre avec le passe-haut (jRCω au numérateur)." },
  { id: "fo-aopinv", subject: "elec", chapter: "AOP", type: "formule",
    nom: "Montage inverseur",
    tex: "V_s = -\\dfrac{R_2}{R_1}\\,V_e",
    variables: ["R₁ : résistance d'entrée", "R₂ : résistance de contre-réaction"],
    quand: "AOP avec contre-réaction sur l'entrée − (régime linéaire).",
    exemple: "R₁ = 1 kΩ, R₂ = 10 kΩ → gain = −10.",
    piege: "Le signe « − » : la sortie est en opposition de phase." },
  { id: "fo-aopni", subject: "elec", chapter: "AOP", type: "formule",
    nom: "Montage non-inverseur",
    tex: "V_s = \\left(1 + \\dfrac{R_2}{R_1}\\right) V_e",
    variables: ["R₁ : résistance vers la masse", "R₂ : résistance de contre-réaction"],
    quand: "AOP avec contre-réaction sur −, entrée appliquée sur +.",
    exemple: "R₁ = 2 kΩ, R₂ = 8 kΩ → gain = 5.",
    piege: "Le gain est toujours ≥ 1 (jamais d'inversion de signe)." },
  { id: "fo-ordre", subject: "elec", chapter: "Diagramme de Bode", type: "methode",
    nom: "Ordre d'un filtre",
    tex: "-20\\ \\text{dB/décade} \\to \\text{ordre 1} \\qquad -20n \\to \\text{ordre } n",
    variables: ["n : ordre du filtre", "pente : mesurée après la coupure"],
    quand: "Pour déterminer l'ordre d'un filtre à partir d'un diagramme de Bode.",
    exemple: "Pente −40 dB/décade → filtre d'ordre 2.",
    piege: "Lire la pente avant la coupure (elle est plate) au lieu d'après." },

  /* ---------- INFORMATIQUE ---------- */
  { id: "fo-malloc", subject: "info", chapter: "Allocation", type: "methode",
    nom: "Allouer un tableau dynamique",
    tex: "\\text{int *t = malloc(n * sizeof(int));}",
    variables: ["n : nombre d'éléments", "sizeof(int) : taille d'un élément"],
    quand: "Quand la taille d'un tableau n'est connue qu'à l'exécution.",
    exemple: "Toujours tester ensuite : if (t == NULL) ...",
    piege: "Oublier le free correspondant → fuite mémoire." },
  { id: "fo-free", subject: "info", chapter: "Allocation", type: "piege",
    nom: "Règle 1 malloc = 1 free",
    tex: "\\text{malloc(...)} \\;\\longrightarrow\\; \\text{free(...)}",
    variables: ["chaque bloc alloué doit être libéré une fois"],
    quand: "À chaque allocation dynamique de mémoire.",
    exemple: "Structure à champ dynamique : free du champ PUIS de la structure.",
    piege: "Réaffecter un pointeur avant free → bloc perdu (fuite définitive)." },
  { id: "fo-fleche", subject: "info", chapter: "Structures", type: "definition",
    nom: "Accès à un champ via pointeur",
    tex: "\\text{p->champ} \\;\\equiv\\; \\text{(*p).champ}",
    variables: ["p : pointeur sur une structure", "champ : membre de la structure"],
    quand: "Pour lire ou écrire un champ quand on a un pointeur sur structure.",
    exemple: "e.age sur une variable, p->age sur un pointeur.",
    piege: "Utiliser le point « . » sur un pointeur au lieu de la flèche." },
];

/* ================== VUE — FORMULES ================== */

function FormulesView({ go, initialSubject }) {
  const [subj, setSubj] = useState(initialSubject || "all");
  const [chap, setChap] = useState("all");
  const [type, setType] = useState("all");

  const chapitres = ["all", ...new Set(
    FORMULAS.filter((f) => subj === "all" || f.subject === subj).map((f) => f.chapter)
  )];
  const filtered = FORMULAS.filter((f) =>
    (subj === "all" || f.subject === subj) &&
    (chap === "all" || f.chapter === chap) &&
    (type === "all" || f.type === type)
  );

  const typeLabel = { formule: "Formule", methode: "Méthode", definition: "Définition", piege: "Piège" };
  const typeColor = { formule: T.cyan, methode: T.green, definition: T.violet, piege: T.coral };

  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Formules</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 13 }}>
        Toutes les formules importantes, rendues proprement, avec leurs variables, leur usage et les pièges.
      </p>

      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 7 }}>
        <button onClick={() => { setSubj("all"); setChap("all"); }} style={chip(T.txt, subj === "all")}>Toutes matières</button>
        {SUBJECTS.map((s) => (
          <button key={s.id} onClick={() => { setSubj(s.id); setChap("all"); }} style={chip(s.color, subj === s.id)}>{s.name}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 7 }}>
        {chapitres.map((c) => (
          <button key={c} onClick={() => setChap(c)} style={chip(T.violet, chap === c)}>
            {c === "all" ? "Tous chapitres" : c}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 13 }}>
        {[["all", "Tous types"], ["formule", "Formule"], ["methode", "Méthode"], ["definition", "Définition"], ["piege", "Piège"]].map(([v, l]) => (
          <button key={v} onClick={() => setType(v)} style={chip(T.cyan, type === v)}>{l}</button>
        ))}
      </div>

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: T.faint, marginBottom: 8 }}>
        {filtered.length} formule{filtered.length !== 1 ? "s" : ""}
      </div>
      {filtered.length === 0 && (
        <div style={{ color: T.dim, fontSize: 13, padding: 14 }}>Aucune formule pour ces filtres.</div>
      )}

      {filtered.map((f) => {
        const sj = subjectById(f.subject);
        return (
          <div key={f.id} style={{
            background: T.bg2, border: `1px solid ${T.line}`, borderLeft: `3px solid ${sj.color}`,
            borderRadius: 12, padding: "13px 15px", marginBottom: 11,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13.5, fontWeight: 700, color: T.txt }}>
                {f.nom}
              </div>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700,
                color: typeColor[f.type], border: `1px solid ${typeColor[f.type]}66`,
                borderRadius: 5, padding: "2px 6px", whiteSpace: "nowrap",
              }}>{typeLabel[f.type]}</span>
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: sj.color, marginTop: 3 }}>
              {sj.name.toUpperCase()} · {f.chapter}
            </div>

            <div style={{
              background: T.bg3, border: `1px solid ${T.line}`, borderRadius: 9,
              padding: "8px 10px", margin: "9px 0",
            }}>
              <MathBlock tex={f.tex} />
            </div>

            <FormulaLine label="Variables" color={sj.color}>
              {f.variables.map((v, i) => (
                <span key={i} style={{ display: "block" }}><MathText>{v}</MathText></span>
              ))}
            </FormulaLine>
            <FormulaLine label="Quand l'utiliser" color={T.cyan}>
              <MathText>{f.quand}</MathText>
            </FormulaLine>
            <FormulaLine label="Exemple rapide" color={T.green}>
              <MathText>{f.exemple}</MathText>
            </FormulaLine>
            <FormulaLine label="Piège fréquent" color={T.coral}>
              <MathText>{f.piege}</MathText>
            </FormulaLine>
          </div>
        );
      })}
    </div>
  );
}

function FormulaLine({ label, color, children }) {
  return (
    <div style={{ marginTop: 7 }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700,
        color, letterSpacing: 0.4,
      }}>{label.toUpperCase()}</span>
      <div style={{ fontSize: 12.6, color: T.txt, lineHeight: 1.6, marginTop: 2 }}>{children}</div>
    </div>
  );
}

/* ================== QUIZ FORMULES ================== */
/* type : choix | trou | usage | situation | erreur
   option : { tex } pour une formule rendue, { t } pour du texte */

const FORMULA_QUIZ = [
  /* ---------- MATHÉMATIQUES ---------- */
  { id: "qf-m1", subject: "math", type: "choix", formulaId: "fo-taylor",
    q: "Quelle écriture correspond à la formule de Taylor-Young ?",
    options: [
      { tex: "f(x) = \\sum_{k=0}^{n} \\dfrac{f^{(k)}(a)}{k!}(x-a)^k + o((x-a)^n)" },
      { tex: "f(x) = \\sum_{k=0}^{n} f(k)\\,(x-a) + o(x)" },
      { tex: "f(x) = \\int_{0}^{n} f^{(k)}(a)\\,dx" },
      { tex: "f(x) = f(a)\\,(x-a)^n" },
    ], a: 0, e: "Taylor-Young : somme des dérivées successives divisées par k!, plus le reste o((x−a)ⁿ)." },
  { id: "qf-m2", subject: "math", type: "usage", formulaId: "fo-riemann",
    q: "À quoi sert la formule des intégrales de Riemann ∫₁^{+∞} dx/xᵅ ?",
    tex: "\\int_{1}^{+\\infty} \\dfrac{dx}{x^{\\alpha}}",
    options: [
      { t: "Déterminer la convergence d'une intégrale généralisée" },
      { t: "Calculer une dérivée" },
      { t: "Inverser une matrice" },
      { t: "Trouver une pulsation propre" },
    ], a: 0, e: "Cette intégrale de référence converge si α > 1 ; on l'utilise par comparaison." },
  { id: "qf-m3", subject: "math", type: "trou", formulaId: "fo-dl-exp",
    q: "Complète le développement limité de sin x en 0 :",
    tex: "\\sin x = x - \\dfrac{?}{3!} + \\dfrac{x^5}{5!} - \\cdots",
    options: [{ tex: "x^3" }, { tex: "x^2" }, { tex: "x" }, { tex: "x^4" }],
    a: 0, e: "sin x = x − x³/3! + x⁵/5! − … : uniquement des puissances impaires." },
  { id: "qf-m4", subject: "math", type: "choix", formulaId: "fo-det2",
    q: "Quelle est la formule du déterminant d'une matrice 2×2 ?",
    options: [{ tex: "ad - bc" }, { tex: "ab - cd" }, { tex: "ac - bd" }, { tex: "ad + bc" }],
    a: 0, e: "det = ad − bc, produit de la diagonale principale moins l'autre." },
  { id: "qf-m5", subject: "math", type: "situation", formulaId: "fo-inv2",
    q: "On veut résoudre AX = B en dimension 2 par la méthode de l'inverse. Quelle formule ?",
    options: [
      { tex: "A^{-1} = \\dfrac{1}{ad-bc}\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}" },
      { tex: "\\det(A) = ad - bc" },
      { tex: "E_c = \\tfrac{1}{2}mv^2" },
      { tex: "U = RI" },
    ], a: 0, e: "X = A⁻¹B : il faut d'abord la formule de l'inverse 2×2." },
  { id: "qf-m6", subject: "math", type: "erreur", formulaId: "fo-equiv",
    q: "Une de ces équivalences en 0 est FAUSSE. Laquelle ?",
    options: [{ tex: "\\sin x \\sim x" }, { tex: "1 - \\cos x \\sim \\dfrac{x^2}{2}" }, { tex: "e^x - 1 \\sim x" }, { tex: "\\cos x \\sim x" }],
    a: 3, e: "Faux : cos x → 1 en 0, donc cos x ∼ 1, pas x." },
  { id: "qf-m7", subject: "math", type: "trou", formulaId: "fo-inv2",
    q: "Quel facteur manque devant la matrice de l'inverse 2×2 ?",
    tex: "A^{-1} = ?\\;\\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}",
    options: [{ tex: "\\dfrac{1}{ad-bc}" }, { tex: "ad-bc" }, { tex: "\\dfrac{1}{ad+bc}" }, { tex: "1" }],
    a: 0, e: "On divise par le déterminant ad − bc (non nul)." },
  { id: "qf-m8", subject: "math", type: "situation", formulaId: "fo-sarrus",
    q: "Pour calculer rapidement un déterminant 3×3, quelle méthode utiliser ?",
    options: [{ t: "La règle de Sarrus" }, { t: "La loi d'Ohm" }, { t: "La formule de Taylor-Young" }, { t: "Le diviseur de tension" }],
    a: 0, e: "Sarrus : trois produits descendants (+) et trois montants (−), valable en 3×3 uniquement." },

  /* ---------- MÉCANIQUE ---------- */
  { id: "qf-c1", subject: "meca", type: "choix", formulaId: "fo-ec",
    q: "Quelle est la formule de l'énergie cinétique ?",
    options: [{ tex: "E_c = \\tfrac{1}{2}mv^2" }, { tex: "E_c = mgz" }, { tex: "E_c = \\tfrac{1}{2}kx^2" }, { tex: "E_c = mv" }],
    a: 0, e: "Ec = ½mv² : la vitesse est au carré." },
  { id: "qf-c2", subject: "meca", type: "trou", formulaId: "fo-ec",
    q: "Complète la formule de l'énergie cinétique :",
    tex: "E_c = \\tfrac{1}{2}\\,m\\,?",
    options: [{ tex: "v^2" }, { tex: "v" }, { tex: "v^3" }, { tex: "2v" }],
    a: 0, e: "Ec = ½mv² : doubler v quadruple Ec." },
  { id: "qf-c3", subject: "meca", type: "usage", formulaId: "fo-pfd",
    q: "À quoi sert le principe fondamental de la dynamique ?",
    tex: "\\sum \\vec{F} = m\\,\\vec{a}",
    options: [
      { t: "Trouver l'accélération et l'équation du mouvement" },
      { t: "Calculer une intégrale généralisée" },
      { t: "Trouver un déterminant" },
      { t: "Calculer un gain en décibels" },
    ], a: 0, e: "Le PFD relie les forces à l'accélération : il donne l'équation du mouvement." },
  { id: "qf-c4", subject: "meca", type: "situation", formulaId: "fo-tec",
    q: "On cherche une vitesse sans vouloir calculer toutes les forces. Quel outil choisir ?",
    options: [
      { t: "Le théorème de l'énergie cinétique" },
      { t: "La loi d'Ohm" },
      { t: "La règle de Sarrus" },
      { t: "Le diviseur de tension" },
    ], a: 0, e: "Le TEC relie directement la variation de vitesse au travail des forces." },
  { id: "qf-c5", subject: "meca", type: "choix", formulaId: "fo-w0",
    q: "Quelle est la pulsation propre d'un système masse-ressort ?",
    options: [{ tex: "\\omega_0 = \\sqrt{\\dfrac{k}{m}}" }, { tex: "\\omega_0 = \\dfrac{k}{m}" }, { tex: "\\omega_0 = \\sqrt{\\dfrac{m}{k}}" }, { tex: "\\omega_0 = \\dfrac{m}{k}" }],
    a: 0, e: "ω₀ = √(k/m) : ne pas oublier la racine carrée." },
  { id: "qf-c6", subject: "meca", type: "erreur", formulaId: "fo-w0",
    q: "Une de ces relations est FAUSSE. Laquelle ?",
    options: [{ tex: "T_0 = \\dfrac{2\\pi}{\\omega_0}" }, { tex: "\\omega_0 = \\sqrt{\\dfrac{k}{m}}" }, { tex: "\\omega = 2\\pi f" }, { tex: "E_c = \\tfrac{1}{2}mv" }],
    a: 3, e: "Faux : l'énergie cinétique est ½mv², avec la vitesse au carré." },
  { id: "qf-c7", subject: "meca", type: "trou", formulaId: "fo-osc",
    q: "Complète l'équation de l'oscillateur harmonique :",
    tex: "\\ddot{x} + ?\\;x = 0",
    options: [{ tex: "\\omega_0^2" }, { tex: "\\omega_0" }, { tex: "2\\omega_0" }, { tex: "\\omega_0^3" }],
    a: 0, e: "ẍ + ω₀²x = 0 : la pulsation propre apparaît au carré." },
  { id: "qf-c8", subject: "meca", type: "situation", formulaId: "fo-tem",
    q: "Bilan énergétique d'un mouvement AVEC frottements. Quelle relation utiliser ?",
    options: [
      { t: "ΔEm = W(forces non conservatives)" },
      { t: "Conservation : ΔEm = 0" },
      { t: "U = R·I" },
      { t: "det = ad − bc" },
    ], a: 0, e: "Avec frottements, Em n'est plus conservée : ΔEm = travail des forces non conservatives." },

  /* ---------- ÉLECTRONIQUE ---------- */
  { id: "qf-e1", subject: "elec", type: "choix", formulaId: "fo-ohm",
    q: "Quelle est la loi d'Ohm ?",
    options: [{ tex: "U = R\\,I" }, { tex: "U = \\dfrac{R}{I}" }, { tex: "U = \\dfrac{I}{R}" }, { tex: "R = U\\,I" }],
    a: 0, e: "U = R·I : la tension est proportionnelle au courant." },
  { id: "qf-e2", subject: "elec", type: "trou", formulaId: "fo-fc",
    q: "Complète la fréquence de coupure d'un filtre RC :",
    tex: "f_c = ?",
    options: [{ tex: "\\dfrac{1}{2\\pi RC}" }, { tex: "2\\pi RC" }, { tex: "\\dfrac{1}{RC}" }, { tex: "\\dfrac{RC}{2\\pi}" }],
    a: 0, e: "f_c = 1/(2πRC). Attention : ω_c = 1/(RC), mais f_c divise encore par 2π." },
  { id: "qf-e3", subject: "elec", type: "choix", formulaId: "fo-transfert",
    q: "Quelle formule donne le gain en décibels ?",
    options: [{ tex: "G = 20\\,\\log_{10}|H|" }, { tex: "G = 10\\,\\log_{10}|H|" }, { tex: "G = |H|^2" }, { tex: "G = 20\\,|H|" }],
    a: 0, e: "Pour une tension : G_dB = 20·log₁₀|H| (le 10·log concerne les puissances)." },
  { id: "qf-e4", subject: "elec", type: "choix", formulaId: "fo-aopni",
    q: "Quelle est la formule du montage AOP non-inverseur ?",
    options: [
      { tex: "V_s = \\left(1 + \\dfrac{R_2}{R_1}\\right) V_e" },
      { tex: "V_s = -\\dfrac{R_2}{R_1}\\,V_e" },
      { tex: "V_s = V_e" },
      { tex: "V_s = \\dfrac{R_2}{R_1}\\,V_e" },
    ], a: 0, e: "Non-inverseur : Vs = (1 + R₂/R₁)·Ve, gain toujours ≥ 1." },
  { id: "qf-e5", subject: "elec", type: "situation", formulaId: "fo-divtension",
    q: "Deux résistances en série, on cherche la tension aux bornes de R₂. Quelle formule ?",
    options: [
      { tex: "U_2 = U\\,\\dfrac{R_2}{R_1 + R_2}" },
      { tex: "U_2 = U\\,\\dfrac{R_1}{R_1 + R_2}" },
      { tex: "U_2 = U\\,(R_1 + R_2)" },
      { tex: "U_2 = R_2\\,I^2" },
    ], a: 0, e: "Diviseur de tension : U₂ = U·R₂/(R₁+R₂)." },
  { id: "qf-e6", subject: "elec", type: "erreur", formulaId: "fo-impedance",
    q: "Une de ces impédances complexes est FAUSSE. Laquelle ?",
    options: [{ tex: "Z_L = jL\\omega" }, { tex: "Z_C = \\dfrac{1}{jC\\omega}" }, { tex: "Z_R = R" }, { tex: "Z_C = jC\\omega" }],
    a: 3, e: "Faux : l'impédance du condensateur est 1/(jCω), pas jCω." },
  { id: "qf-e7", subject: "elec", type: "usage", formulaId: "fo-tau",
    q: "À quoi sert la constante de temps τ = RC ?",
    tex: "\\tau = R\\,C",
    options: [
      { t: "Décrire la charge / décharge d'un circuit RC" },
      { t: "Calculer un gain en décibels" },
      { t: "Trouver une pulsation propre" },
      { t: "Calculer un déterminant" },
    ], a: 0, e: "τ donne la rapidité du régime transitoire : à t = τ, on atteint 63 % de la valeur finale." },
  { id: "qf-e8", subject: "elec", type: "trou", formulaId: "fo-passebas",
    q: "Complète la fonction de transfert d'un filtre passe-bas RC :",
    tex: "H(j\\omega) = \\dfrac{1}{1 + ?}",
    options: [{ tex: "jRC\\omega" }, { tex: "RC\\omega" }, { tex: "j\\omega" }, { tex: "\\dfrac{R}{C}" }],
    a: 0, e: "Passe-bas RC : H = 1/(1 + jRCω)." },
];

/* ================== VUE — QUIZ FORMULES ================== */

const FQ_TYPE_LABEL = {
  choix: "Choisir la bonne formule",
  trou: "Compléter la formule",
  usage: "À quoi sert la formule",
  situation: "Formule adaptée à la situation",
  erreur: "Repérer l'erreur",
};

function FormulesQuizView({ go }) {
  const [subj, setSubj] = useState(null);

  if (subj) {
    const questions = FORMULA_QUIZ.filter((q) => q.subject === subj);
    return <FormulaQuizRunner subject={subj} questions={questions} back={() => setSubj(null)} go={go} />;
  }

  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Quiz formules</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 14 }}>
        Un entraînement spécial pour mémoriser les formules : choisir la bonne, compléter un trou,
        repérer une erreur, trouver à quoi elle sert. Correction immédiate à chaque question.
      </p>
      {SUBJECTS.filter((s) => s.id !== "info").map((s) => {
        const n = FORMULA_QUIZ.filter((q) => q.subject === s.id).length;
        return (
          <div key={s.id} onClick={() => setSubj(s.id)}
            style={{
              background: T.bg2, border: `1px solid ${T.line}`, borderLeft: `3px solid ${s.color}`,
              borderRadius: 11, padding: "14px 16px", marginBottom: 9, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 11,
            }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 700, color: T.txt }}>
                Quiz formules · {s.name}
              </div>
              <div style={{ fontSize: 11.5, color: T.dim, marginTop: 2 }}>{n} questions · 5 types · correction immédiate</div>
            </div>
            <span style={{ color: T.faint, fontSize: 17 }}>›</span>
          </div>
        );
      })}
      <Callout kind="tip" title="Astuce">
        Après chaque réponse, le bouton « Voir la formule » t'amène à la fiche formule complète
        (variables, usage, piège).
      </Callout>
    </div>
  );
}

function FormulaQuizRunner({ subject, questions, back, go }) {
  const sj = subjectById(subject);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const topRef = useRef(null);
  useEffect(() => { if (topRef.current) topRef.current.scrollIntoView({ block: "start" }); }, [idx, done]);

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div ref={topRef}>
        <BackBar onBack={back} label="Quiz formules" />
        <div style={{
          background: `linear-gradient(140deg, ${sj.color}22, ${T.bg2})`,
          border: `1px solid ${sj.color}66`, borderRadius: 14, padding: "22px 18px", textAlign: "center",
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: sj.color, letterSpacing: 1.5 }}>
            QUIZ FORMULES · {sj.name.toUpperCase()}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 40, fontWeight: 800, color: T.txt, margin: "8px 0 2px" }}>
            {score}/{questions.length}
          </div>
          <div style={{ fontSize: 13, color: T.dim }}>{pct}% de bonnes réponses</div>
          <p style={{ fontSize: 12.7, color: T.txt, lineHeight: 1.55, margin: "12px 0 14px" }}>
            {pct >= 80 ? "Excellent — tes formules sont solides." : pct >= 50 ? "Pas mal — révise les formules ratées dans la section Formules." : "À retravailler : ouvre la section Formules et reviens t'entraîner."}
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => { setIdx(0); setPicked(null); setScore(0); setDone(false); }} style={primBtn(sj.color)}>Recommencer</button>
            <button onClick={() => go({ view: "formules", subject })} style={ghostBtn()}>Section Formules</button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const answered = picked !== null;
  const formula = FORMULAS.find((f) => f.id === q.formulaId);

  function choose(i) {
    if (answered) return;
    setPicked(i);
    if (i === q.a) setScore((s) => s + 1);
  }
  function next() {
    if (idx + 1 >= questions.length) setDone(true);
    else { setIdx(idx + 1); setPicked(null); }
  }

  return (
    <div ref={topRef}>
      <BackBar onBack={back} label="Quiz formules" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: sj.color }}>
          {sj.name} · {idx + 1}/{questions.length}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.dim }}>Score {score}</span>
      </div>
      <div style={{ height: 5, background: T.bg3, borderRadius: 3, overflow: "hidden", marginBottom: 14 }}>
        <div style={{ width: `${((idx + (answered ? 1 : 0)) / questions.length) * 100}%`, height: "100%", background: sj.color, transition: "width 0.3s" }} />
      </div>

      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700,
        color: sj.color, letterSpacing: 0.6, marginBottom: 5,
      }}>{(FQ_TYPE_LABEL[q.type] || "").toUpperCase()}</div>
      <div style={{ fontSize: 14.5, color: T.txt, fontWeight: 600, lineHeight: 1.5, marginBottom: q.tex ? 8 : 13 }}>
        {q.q}
      </div>
      {q.tex && (
        <div style={{ background: T.bg3, border: `1px solid ${T.line}`, borderRadius: 9, padding: "8px 10px", marginBottom: 13 }}>
          <MathBlock tex={q.tex} />
        </div>
      )}

      {q.options.map((opt, i) => {
        let bg = T.bg2, bd = T.line, col = T.txt;
        if (answered) {
          if (i === q.a) { bg = "rgba(95,207,142,0.15)"; bd = T.green; col = T.green; }
          else if (i === picked) { bg = "rgba(236,106,94,0.15)"; bd = T.coral; col = T.coral; }
        }
        return (
          <button key={i} onClick={() => choose(i)} disabled={answered}
            style={{
              display: "block", width: "100%", textAlign: "left", background: bg,
              border: `1px solid ${bd}`, borderRadius: 10, padding: "11px 13px", margin: "6px 0",
              cursor: answered ? "default" : "pointer", color: col,
            }}>
            {opt.tex
              ? <span style={{ fontSize: 13.5 }}><Formula tex={opt.tex} /></span>
              : <span style={{ fontSize: 13, fontFamily: "'Spectral', serif" }}>{opt.t}</span>}
          </button>
        );
      })}

      {answered && (
        <div style={{
          background: T.bg2, border: `1px solid ${T.line}`,
          borderLeft: `3px solid ${picked === q.a ? T.green : T.coral}`,
          borderRadius: 10, padding: "11px 13px", marginTop: 10,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: picked === q.a ? T.green : T.coral, marginBottom: 4 }}>
            {picked === q.a ? "✓ Bonne réponse" : "✗ Mauvaise réponse"}
          </div>
          <p style={{ fontSize: 12.7, color: T.txt, lineHeight: 1.6, margin: 0 }}>{q.e}</p>
          {formula && (
            <button onClick={() => go({ view: "formules", subject })}
              style={{ ...ghostBtn(), marginTop: 9 }}>
              ∑ Voir la formule : {formula.nom}
            </button>
          )}
        </div>
      )}

      {answered && (
        <button onClick={next} style={{ ...primBtn(sj.color), width: "100%", marginTop: 12 }}>
          {idx + 1 >= questions.length ? "Voir le score" : "Question suivante"}
        </button>
      )}
    </div>
  );
}

/* ================== EXERCICES ================== */

function ExoList({ exos, progress, handlers }) {
  const [open, setOpen] = useState(null);
  if (open) {
    const ex = exos.find((e) => e.id === open) || EXOS.find((e) => e.id === open);
    return <ExoRunner exo={ex} back={() => setOpen(null)} progress={progress} handlers={handlers} />;
  }
  return (
    <div>
      {exos.length === 0 && <div style={{ color: T.dim, fontSize: 13, padding: 16 }}>Aucun exercice pour ce filtre.</div>}
      {exos.map((ex) => {
        const sj = subjectById(ex.subject);
        const done = (progress.exos || []).includes(ex.id);
        return (
          <div key={ex.id} onClick={() => setOpen(ex.id)}
            style={{
              background: T.bg2, border: `1px solid ${T.line}`,
              borderLeft: `3px solid ${sj.color}`, borderRadius: 11,
              padding: "12px 14px", marginBottom: 8, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 11,
            }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 13.3, fontWeight: 700, color: T.txt,
              }}>{ex.title}</div>
              <div style={{ display: "flex", gap: 6, marginTop: 5, flexWrap: "wrap", alignItems: "center" }}>
                <DiffBadge d={ex.difficulty} />
                <span style={{ fontSize: 10.5, color: T.faint, fontFamily: "'JetBrains Mono', monospace" }}>⏱ {ex.temps}</span>
                {ex.tags.map((t, i) => (
                  <span key={i} style={{ fontSize: 10, color: T.dim }}>#{t}</span>
                ))}
              </div>
            </div>
            {done && <span style={{ color: T.green, fontSize: 13 }}>✓</span>}
            <span style={{ color: T.faint, fontSize: 16 }}>›</span>
          </div>
        );
      })}
    </div>
  );
}

/* ============ TERMINAL DE PRATIQUE — CODE C ============ */
function TerminalCodePractice({ storageKey, funcName, criteria, indice, correctionBlocks, conseil, erreur, fiches, go, forceCorrection }) {
  const MONO = "'JetBrains Mono', monospace";
  const [code, setCode] = useState(() => {
    try { return eceStorage.get(storageKey) || ""; } catch (e) { return ""; }
  });
  const [ran, setRan] = useState(false);
  const [showInd, setShowInd] = useState(false);
  const [showCorr, setShowCorr] = useState(false);
  const taRef = useRef(null);
  const gutRef = useRef(null);

  const save = (v) => { setCode(v); try { eceStorage.set(storageKey, v); } catch (e) {} };
  const crit = criteria || [];
  const evalC = (c) => {
    const a = code.toLowerCase();
    if (!code.trim()) return "absent";
    if (c.k.some((k) => a.indexOf(String(k).toLowerCase()) !== -1)) return "ok";
    if (c.w && c.w.some((k) => a.indexOf(String(k).toLowerCase()) !== -1)) return "warn";
    return "absent";
  };
  const results = crit.map((c) => ({ l: c.l, st: evalC(c) }));
  const okN = results.filter((r) => r.st === "ok").length;
  const warnN = results.filter((r) => r.st === "warn").length;
  const absN = results.filter((r) => r.st === "absent").length;
  const total = crit.length || 1;
  const pct = Math.round(((okN + warnN * 0.5) / total) * 100);
  const empty = !code.trim();
  const corrOpen = showCorr || forceCorrection;
  const okFirst = results.find((r) => r.st === "ok");
  const gapFirst = results.find((r) => r.st !== "ok");
  const lower = (s) => s.charAt(0).toLowerCase() + s.slice(1);
  const lineCount = Math.max(code.split("\n").length, 14);

  const onKey = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.target, s = el.selectionStart, en = el.selectionEnd;
      save(code.slice(0, s) + "  " + code.slice(en));
      requestAnimationFrame(() => { try { el.selectionStart = el.selectionEnd = s + 2; } catch (e2) {} });
    }
  };
  const onScroll = (e) => { if (gutRef.current) gutRef.current.scrollTop = e.target.scrollTop; };
  const tbtn = (bg, fg, bd) => ({
    fontFamily: MONO, fontSize: 10.8, fontWeight: 700, cursor: "pointer",
    padding: "6px 11px", borderRadius: 7, background: bg, color: fg, border: `1px solid ${bd}`,
  });

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid #2a2f3d", background: "#0a0b0f" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 11px", background: "#13151c", borderBottom: "1px solid #2a2f3d" }}>
          <span style={{ display: "flex", gap: 5 }}>
            {["#ec5f53", "#e8c84a", "#5fcf8e"].map((c) => (
              <span key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, display: "block" }} />
            ))}
          </span>
          <span style={{ fontFamily: MONO, fontSize: 11, color: "#8a93a6" }}>terminal.c</span>
          <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 9.3, color: "#5b6273" }}>
            {funcName ? funcName + "()" : "langage C"}
          </span>
        </div>
        <div style={{ display: "flex", maxHeight: 330, background: "#0a0b0f" }}>
          <div ref={gutRef} style={{
            overflow: "hidden", textAlign: "right", padding: "11px 8px 11px 10px",
            fontFamily: MONO, fontSize: 12.3, lineHeight: "1.6em", color: "#3c4458",
            userSelect: "none", flexShrink: 0, background: "#0d0f15", borderRight: "1px solid #1c2029",
          }}>
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} style={{ height: "1.6em" }}>{i + 1}</div>
            ))}
          </div>
          <textarea
            ref={taRef} value={code} onChange={(e) => save(e.target.value)}
            onKeyDown={onKey} onScroll={onScroll} wrap="off" spellCheck={false}
            placeholder={"// Écris ta fonction en C ici…\n// " + (funcName ? funcName + "(...) {" : "maFonction(...) {") + "\n//   ...\n// }"}
            style={{
              flex: 1, minWidth: 0, border: "none", outline: "none", resize: "vertical",
              background: "#0a0b0f", color: "#d6dbe6", padding: "11px 12px",
              fontFamily: MONO, fontSize: 12.3, lineHeight: "1.6em",
              whiteSpace: "pre", overflow: "auto", minHeight: 160,
            }} />
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", padding: "8px 9px", background: "#13151c", borderTop: "1px solid #2a2f3d" }}>
          <button onClick={() => setRan(true)} style={tbtn(T.green, "#08130c", T.green)}>▶ Run check</button>
          <button onClick={() => setShowInd((s) => !s)} style={tbtn("#1c2029", T.yellow, "#2a2f3d")}>💡 {showInd ? "Cacher l'indice" : "Indice"}</button>
          <button onClick={() => setShowCorr((s) => !s)} style={tbtn("#1c2029", T.cyan, "#2a2f3d")}>◉ Correction</button>
          <button onClick={() => { save(""); setRan(false); }} style={tbtn("#1c2029", "#8a93a6", "#2a2f3d")}>↺ Réinitialiser</button>
        </div>
      </div>

      {ran && (
        <div style={{
          marginTop: 9, background: "#0a0b0f", border: "1px solid #2a2f3d", borderRadius: 10,
          padding: "11px 13px", fontFamily: MONO, fontSize: 11.6, lineHeight: 1.75, overflowX: "auto",
        }}>
          <div style={{ color: "#5b6273" }}>$ run check — {funcName ? funcName + "()" : "ta fonction"}</div>
          {empty ? (
            <div style={{ color: T.amber, marginTop: 3 }}>⚠️ Éditeur vide — écris ton code puis relance la vérification.</div>
          ) : (
            <>
              {results.map((r, i) => (
                <div key={i} style={{ color: r.st === "ok" ? T.green : r.st === "warn" ? T.amber : T.coral, whiteSpace: "pre-wrap" }}>
                  {r.st === "ok" ? "✅" : r.st === "warn" ? "⚠️" : "❌"} {r.l}
                </div>
              ))}
              <div style={{ marginTop: 6, fontWeight: 800, color: pct >= 70 ? T.green : pct >= 40 ? T.amber : T.coral }}>
                Score estimé : {pct}%
              </div>
            </>
          )}
        </div>
      )}

      {ran && !empty && (
        <div style={{ marginTop: 9, background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 10, padding: "11px 13px" }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8, fontFamily: MONO, fontSize: 11 }}>
            <span style={{ color: T.green }}>✅ {okN} validé{okN > 1 ? "s" : ""}</span>
            <span style={{ color: T.amber }}>⚠️ {warnN} à revoir</span>
            <span style={{ color: T.coral }}>❌ {absN} absent{absN > 1 ? "s" : ""}</span>
          </div>
          <p style={{ fontSize: 12.4, color: T.txt, lineHeight: 1.55, margin: "0 0 7px" }}>
            {okFirst ? `Tu as bien : ${lower(okFirst.l)}.` : "Aucun critère validé pour l'instant."}
            {gapFirst ? ` Il reste à travailler : ${lower(gapFirst.l)}.` : " Tous les critères sont couverts — beau travail."}
          </p>
          {conseil && (
            <p style={{ fontSize: 12, color: T.dim, lineHeight: 1.5, margin: "0 0 5px" }}>
              💡 <b style={{ color: T.cyan }}>Conseil</b> — {conseil}
            </p>
          )}
          {erreur && (
            <p style={{ fontSize: 12, color: T.dim, lineHeight: 1.5, margin: "0 0 5px" }}>
              ⚠️ <b style={{ color: T.amber }}>Erreur classique</b> — {erreur}
            </p>
          )}
          {fiches && fiches.length > 0 && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 7 }}>
              <span style={{ fontFamily: MONO, fontSize: 9.5, color: T.faint, alignSelf: "center" }}>FICHE :</span>
              {fiches.map((fid) => {
                const f = ALL_FICHES.find((x) => x.id === fid);
                if (!f) return null;
                return (
                  <button key={fid} onClick={() => go && go({ view: "subject", id: f.subject, fiche: f.id })}
                    style={{ fontFamily: MONO, fontSize: 10, color: T.cyan, background: `${T.cyan}14`, border: `1px solid ${T.cyan}44`, borderRadius: 6, padding: "3px 8px", cursor: go ? "pointer" : "default" }}>
                    {f.title} ›
                  </button>
                );
              })}
            </div>
          )}
          {!corrOpen && (
            <button onClick={() => setShowCorr(true)} style={{ ...primBtn(T.green), marginTop: 9 }}>
              ◉ Voir la correction complète
            </button>
          )}
        </div>
      )}

      {showInd && indice && (
        <div style={{ marginTop: 9, background: "rgba(232,200,74,0.08)", border: `1px solid ${T.yellow}44`, borderRadius: 9, padding: "9px 12px" }}>
          <PanelLabel color={T.yellow}>Indice</PanelLabel>
          <div style={{ fontSize: 12.6, color: T.txt, lineHeight: 1.55 }}>{indice}</div>
        </div>
      )}

      {corrOpen && correctionBlocks && (
        <div style={{ marginTop: 9, background: "rgba(95,207,142,0.06)", border: `1px solid ${T.green}38`, borderRadius: 9, padding: "10px 13px" }}>
          <PanelLabel color={T.green}>Correction complète</PanelLabel>
          {correctionBlocks.map((b, i) => <Block key={i} b={b} color={T.green} />)}
        </div>
      )}
    </div>
  );
}

function InteractiveExoView({ exo, sj, back, progress, handlers }) {
  const inter = EXO_INTERACTIVE[exo.id];
  const done = (progress.exos || []).includes(exo.id);
  const topRef = useRef(null);
  useEffect(() => { if (topRef.current) topRef.current.scrollIntoView({ block: "start" }); }, []);

  return (
    <div ref={topRef}>
      <BackBar onBack={back} label="Liste des exercices" />
      <div style={{ borderLeft: `3px solid ${sj.color}`, paddingLeft: 13, marginBottom: 12 }}>
        <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: sj.color, fontFamily: "'JetBrains Mono', monospace" }}>{sj.name}</span>
          <DiffBadge d={exo.difficulty} />
          <span style={{ fontSize: 10.5, color: T.faint, fontFamily: "'JetBrains Mono', monospace" }}>⏱ {exo.temps}</span>
          <span style={{
            fontSize: 9.5, color: T.cyan, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
            background: `${T.cyan}1a`, border: `1px solid ${T.cyan}55`, borderRadius: 5, padding: "2px 7px",
          }}>● MODE TERMINAL</span>
        </div>
        <h2 style={{ ...titleSt(19), marginTop: 5 }}>{exo.title}</h2>
      </div>

      <div style={panelSt()}>
        <PanelLabel color={sj.color}>Énoncé</PanelLabel>
        {exo.enonce.map((b, i) => <Block key={i} b={b} color={sj.color} />)}
      </div>
      <div style={panelSt()}>
        <PanelLabel color={T.cyan}>Méthode conseillée</PanelLabel>
        <ol style={{ margin: "3px 0", paddingLeft: 19 }}>
          {exo.methode.map((m, i) => (
            <li key={i} style={{ fontSize: 13, color: T.txt, lineHeight: 1.6, margin: "4px 0" }}>{m}</li>
          ))}
        </ol>
      </div>

      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.faint,
        letterSpacing: 1, margin: "4px 0 0",
      }}>
        ÉCRIS TA RÉPONSE EN C — VÉRIFICATION PAR CRITÈRES
      </div>
      <TerminalCodePractice
        storageKey={"ece-ans-" + exo.id}
        funcName={inter.func}
        criteria={inter.criteres}
        indice={exo.indice}
        correctionBlocks={exo.correction}
        conseil={inter.conseil}
        erreur={inter.erreur}
        fiches={inter.fiches}
        go={handlers.go} />

      <button onClick={() => handlers.markExo(exo.id)}
        style={{ ...primBtn(done ? T.faint : T.green), width: "100%", marginTop: 11 }}>
        {done ? "✓ Exercice marqué comme fait" : "Marquer comme fait"}
      </button>
    </div>
  );
}

function ExoRunner({ exo, back, progress, handlers }) {
  const sj = subjectById(exo.subject);
  if (EXO_INTERACTIVE[exo.id]) {
    return <InteractiveExoView exo={exo} sj={sj} back={back} progress={progress} handlers={handlers} />;
  }
  const [indice, setIndice] = useState(false);
  const [corr, setCorr] = useState(false);
  const done = (progress.exos || []).includes(exo.id);
  const topRef = useRef(null);
  useEffect(() => { if (topRef.current) topRef.current.scrollIntoView({ block: "start" }); }, []);

  return (
    <div ref={topRef}>
      <BackBar onBack={back} label="Liste des exercices" />
      <div style={{ borderLeft: `3px solid ${sj.color}`, paddingLeft: 13, marginBottom: 13 }}>
        <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: sj.color, fontFamily: "'JetBrains Mono', monospace" }}>{sj.name}</span>
          <DiffBadge d={exo.difficulty} />
          <span style={{ fontSize: 10.5, color: T.faint, fontFamily: "'JetBrains Mono', monospace" }}>⏱ {exo.temps}</span>
        </div>
        <h2 style={{ ...titleSt(19), marginTop: 5 }}>{exo.title}</h2>
      </div>

      <div style={panelSt()}>
        <PanelLabel color={sj.color}>Énoncé</PanelLabel>
        {exo.enonce.map((b, i) => <Block key={i} b={b} color={sj.color} />)}
      </div>

      <div style={panelSt()}>
        <PanelLabel color={T.cyan}>Méthode</PanelLabel>
        <ol style={{ margin: "3px 0", paddingLeft: 19 }}>
          {exo.methode.map((m, i) => (
            <li key={i} style={{ fontSize: 13, color: T.txt, lineHeight: 1.6, margin: "4px 0" }}>{m}</li>
          ))}
        </ol>
      </div>

      {!indice ? (
        <button onClick={() => setIndice(true)} style={{ ...ghostBtn(), width: "100%", marginBottom: 10 }}>
          💡 Voir l'indice
        </button>
      ) : (
        <div style={{
          background: "rgba(232,200,74,0.08)", border: `1px solid ${T.yellow}44`,
          borderRadius: 10, padding: "11px 13px", marginBottom: 10,
        }}>
          <PanelLabel color={T.yellow}>Indice</PanelLabel>
          <div style={{ fontSize: 13, color: T.txt, lineHeight: 1.6 }}>{exo.indice}</div>
        </div>
      )}

      {!corr ? (
        <button onClick={() => setCorr(true)} style={{ ...primBtn(sj.color), width: "100%" }}>
          Voir la correction
        </button>
      ) : (
        <>
          <div style={panelSt()}>
            <PanelLabel color={T.green}>Correction</PanelLabel>
            {exo.correction.map((b, i) => <Block key={i} b={b} color={T.green} />)}
          </div>
          <button onClick={() => handlers.markExo(exo.id)}
            style={{ ...primBtn(done ? T.faint : T.green), width: "100%" }}>
            {done ? "✓ Exercice marqué comme fait" : "Marquer comme fait"}
          </button>
        </>
      )}
    </div>
  );
}

/* ================== QUIZ ================== */

function QuizList({ quizzes, progress, handlers, showPartiel }) {
  const [open, setOpen] = useState(null);
  if (open) {
    const qz = open === "partiel" ? QUIZ_MODE_PARTIEL : quizzes.find((q) => q.id === open) || QUIZZES.find((q) => q.id === open);
    return <QuizRunner qz={qz} back={() => setOpen(null)} progress={progress} handlers={handlers} />;
  }
  return (
    <div>
      {showPartiel && (
        <div onClick={() => setOpen("partiel")}
          style={{
            background: `linear-gradient(120deg, ${T.coral}22, ${T.bg2})`,
            border: `1px solid ${T.coral}55`, borderRadius: 12,
            padding: "13px 15px", marginBottom: 12, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 11,
          }}>
          <span style={{ fontSize: 19, color: T.coral }}>★</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13.5, fontWeight: 800, color: T.txt }}>
              Mode Partiel — toutes matières
            </div>
            <div style={{ fontSize: 11.5, color: T.dim }}>{QUIZ_MODE_PARTIEL.questions.length} questions mélangées des 4 matières.</div>
          </div>
          <span style={{ color: T.faint, fontSize: 17 }}>›</span>
        </div>
      )}
      {quizzes.map((q) => {
        const sj = subjectById(q.subject);
        const best = (progress.quiz || {})[q.id];
        return (
          <div key={q.id} onClick={() => setOpen(q.id)}
            style={{
              background: T.bg2, border: `1px solid ${T.line}`,
              borderLeft: `3px solid ${sj.color}`, borderRadius: 11,
              padding: "12px 14px", marginBottom: 8, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 11,
            }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: T.txt }}>{q.title}</div>
              <div style={{ fontSize: 11, color: T.faint, marginTop: 2 }}>
                {q.questions.length} questions · {q.kind === "vf" ? "vrai / faux" : "QCM"}
              </div>
            </div>
            {best != null && (
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700,
                color: best.pct >= 70 ? T.green : best.pct >= 40 ? T.amber : T.coral,
                border: "1px solid currentColor", borderRadius: 6, padding: "3px 7px",
              }}>{best.pct}%</span>
            )}
            <span style={{ color: T.faint, fontSize: 16 }}>›</span>
          </div>
        );
      })}
    </div>
  );
}

function QuizRunner({ qz, back, progress, handlers }) {
  const sjColor = qz.subject ? subjectById(qz.subject).color : T.coral;
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const topRef = useRef(null);
  const q = qz.questions[idx];
  useEffect(() => { if (topRef.current) topRef.current.scrollIntoView({ block: "start" }); }, [idx, done]);

  function choose(i) {
    if (picked != null) return;
    setPicked(i);
    if (i === q.a) setScore(score + 1);
  }
  function next() {
    if (idx + 1 < qz.questions.length) { setIdx(idx + 1); setPicked(null); }
    else {
      const pct = Math.round((score / qz.questions.length) * 100);
      if (qz.id && qz.subject) handlers.saveQuiz(qz.id, pct);
      setDone(true);
    }
  }
  function restart() { setIdx(0); setPicked(null); setScore(0); setDone(false); }

  if (done) {
    const pct = Math.round((score / qz.questions.length) * 100);
    return (
      <div ref={topRef}>
        <BackBar onBack={back} label="Liste des quiz" />
        <div style={{
          background: T.bg2, border: `1px solid ${sjColor}`, borderRadius: 14,
          padding: "28px 20px", textAlign: "center",
        }}>
          <Ring pct={pct} label={`${pct}%`} color={sjColor} size={94} />
          <div style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 800,
            color: T.txt, marginTop: 9,
          }}>{score} / {qz.questions.length} bonnes réponses</div>
          <p style={{ fontSize: 12.5, color: T.dim, marginTop: 5 }}>
            {pct >= 80 ? "Excellent, c'est solide." : pct >= 50 ? "Pas mal — revois les ratées." : "À retravailler : relis la fiche."}
          </p>
          <div style={{ display: "flex", gap: 9, justifyContent: "center", marginTop: 15, flexWrap: "wrap" }}>
            <button onClick={restart} style={primBtn(sjColor)}>Recommencer</button>
            <button onClick={back} style={ghostBtn()}>Retour</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={topRef}>
      <BackBar onBack={back} label="Quitter le quiz" />
      <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 13 }}>
        <div style={{ flex: 1, height: 6, background: T.bg3, borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${(idx / qz.questions.length) * 100}%`, height: "100%", background: sjColor, transition: "width 0.3s" }} />
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.dim }}>{idx + 1}/{qz.questions.length}</span>
      </div>

      <div style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 14, padding: "17px" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: sjColor, letterSpacing: 1, marginBottom: 8 }}>
          {qz.title.toUpperCase()}
        </div>
        <div style={{ fontSize: 15, color: T.txt, lineHeight: 1.5, fontWeight: 600, marginBottom: 15 }}>{q.q}</div>
        {q.o.map((opt, i) => {
          let bg = T.bg3, bd = T.line, col = T.txt;
          if (picked != null) {
            if (i === q.a) { bg = "rgba(95,207,142,0.16)"; bd = T.green; col = T.green; }
            else if (i === picked) { bg = "rgba(236,106,94,0.16)"; bd = T.coral; col = T.coral; }
          }
          return (
            <button key={i} onClick={() => choose(i)} disabled={picked != null}
              style={{
                display: "block", width: "100%", textAlign: "left", background: bg,
                border: `1px solid ${bd}`, borderRadius: 9, padding: "10px 13px", margin: "6px 0",
                cursor: picked != null ? "default" : "pointer", color: col,
                fontSize: 13.4, lineHeight: 1.45, fontFamily: "'Spectral', serif",
              }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, marginRight: 8, opacity: 0.7 }}>
                {String.fromCharCode(65 + i)}
              </span>{opt}
            </button>
          );
        })}
        {picked != null && (
          <div style={{
            marginTop: 11, padding: "10px 12px", borderRadius: 9,
            background: picked === q.a ? "rgba(95,207,142,0.1)" : "rgba(236,106,94,0.1)",
            border: `1px solid ${picked === q.a ? T.green : T.coral}44`,
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 700, color: picked === q.a ? T.green : T.coral, marginBottom: 3 }}>
              {picked === q.a ? "✓ Correct" : "✗ Incorrect"}
            </div>
            <div style={{ fontSize: 12.7, color: T.txt, lineHeight: 1.55 }}>{q.e}</div>
          </div>
        )}
        {picked != null && (
          <button onClick={next} style={{ ...primBtn(sjColor), width: "100%", marginTop: 13 }}>
            {idx + 1 < qz.questions.length ? "Question suivante ›" : "Voir le résultat"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ================== FLASHCARDS ================== */

function CardDeck({ cards, progress, handlers }) {
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  useEffect(() => { setOrder(cards.map((_, i) => i)); setPos(0); setFlipped(false); }, [cards]);

  if (cards.length === 0)
    return <div style={{ color: T.dim, fontSize: 13, padding: 16 }}>Aucune carte pour ce filtre.</div>;

  const card = cards[order[pos]];
  const sj = subjectById(card.subject);
  const status = (progress.cards || {})[card.id];
  const knownInSet = cards.filter((c) => (progress.cards || {})[c.id] === "ok").length;

  function shuffle() {
    const a = [...order];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    setOrder(a); setPos(0); setFlipped(false);
  }
  function nav(d) {
    setPos((p) => (p + d + cards.length) % cards.length);
    setFlipped(false);
  }
  function mark(v) {
    handlers.setCard(card.id, status === v ? null : v);
    setTimeout(() => nav(1), 180);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.dim }}>
          Carte {pos + 1}/{cards.length} · {knownInSet} sues
        </span>
        <button onClick={shuffle} style={ghostBtn()}>⮂ Mélanger</button>
      </div>

      <FlipCard card={card} flipped={flipped} onFlip={() => setFlipped(!flipped)} color={sj.color} />

      <div style={{ display: "flex", gap: 8, marginTop: 11 }}>
        <button onClick={() => nav(-1)} style={{ ...ghostBtn(), flex: "0 0 auto" }}>‹</button>
        <button onClick={() => mark("revoir")}
          style={{
            flex: 1, background: status === "revoir" ? T.coral : T.bg3,
            color: status === "revoir" ? T.bg : T.dim,
            border: `1px solid ${status === "revoir" ? T.coral : T.line}`, borderRadius: 9,
            padding: "10px", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11.5, fontWeight: 700,
          }}>À revoir</button>
        <button onClick={() => mark("ok")}
          style={{
            flex: 1, background: status === "ok" ? T.green : T.bg3,
            color: status === "ok" ? T.bg : T.dim,
            border: `1px solid ${status === "ok" ? T.green : T.line}`, borderRadius: 9,
            padding: "10px", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11.5, fontWeight: 700,
          }}>Je sais ✓</button>
        <button onClick={() => nav(1)} style={{ ...ghostBtn(), flex: "0 0 auto" }}>›</button>
      </div>
    </div>
  );
}

function FlashcardsView({ progress, handlers, go }) {
  const [subj, setSubj] = useState("all");
  const [type, setType] = useState("all");
  const types = [
    { id: "all", l: "Tous" }, { id: "def", l: "Définitions" },
    { id: "formule", l: "Formules" }, { id: "piege", l: "Pièges" }, { id: "methode", l: "Méthodes" },
  ];
  const filtered = FLASHCARDS.filter(
    (c) => (subj === "all" || c.subject === subj) && (type === "all" || c.type === type)
  );

  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Flashcards</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 13 }}>
        {FLASHCARDS.length} cartes — tape une carte pour la retourner, puis marque « je sais » ou « à revoir ».
      </p>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 8 }}>
        <button onClick={() => setSubj("all")} style={chip(T.txt, subj === "all")}>Toutes matières</button>
        {SUBJECTS.map((s) => (
          <button key={s.id} onClick={() => setSubj(s.id)} style={chip(s.color, subj === s.id)}>{s.name}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 14 }}>
        {types.map((t) => (
          <button key={t.id} onClick={() => setType(t.id)} style={chip(T.violet, type === t.id)}>{t.l}</button>
        ))}
      </div>
      <CardDeck cards={filtered} progress={progress} handlers={handlers} />
    </div>
  );
}

/* ================== QUIZ GLOBAL ================== */

function QuizGlobalView({ progress, handlers, go }) {
  const [subj, setSubj] = useState("all");
  const filtered = subj === "all" ? QUIZZES : QUIZZES.filter((q) => q.subject === subj);
  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Quiz</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 13 }}>
        Correction immédiate, explication et score. Recommençable à volonté.
      </p>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 14 }}>
        <button onClick={() => setSubj("all")} style={chip(T.txt, subj === "all")}>Toutes</button>
        {SUBJECTS.map((s) => (
          <button key={s.id} onClick={() => setSubj(s.id)} style={chip(s.color, subj === s.id)}>{s.name}</button>
        ))}
      </div>
      <QuizList quizzes={filtered} progress={progress} handlers={handlers} showPartiel />
    </div>
  );
}

/* ================== EXERCICES GLOBAL ================== */

function ExosGlobalView({ progress, handlers, go }) {
  const [subj, setSubj] = useState("all");
  const [diff, setDiff] = useState("all");
  const diffs = [
    { id: "all", l: "Toutes difficultés" }, { id: "facile", l: "Facile" },
    { id: "moyen", l: "Moyen" }, { id: "partiel", l: "Niveau partiel" },
  ];
  const filtered = EXOS.filter(
    (e) => (subj === "all" || e.subject === subj) && (diff === "all" || e.difficulty === diff)
  );
  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Exercices / Annales</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 13 }}>
        Exercices issus des TD et partiels du zip. Méthode, indice puis correction masquée.
      </p>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 8 }}>
        <button onClick={() => setSubj("all")} style={chip(T.txt, subj === "all")}>Toutes</button>
        {SUBJECTS.map((s) => (
          <button key={s.id} onClick={() => setSubj(s.id)} style={chip(s.color, subj === s.id)}>{s.name}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 14 }}>
        {diffs.map((d) => (
          <button key={d.id} onClick={() => setDiff(d.id)} style={chip(T.amber, diff === d.id)}>{d.l}</button>
        ))}
      </div>
      <ExoList exos={filtered} progress={progress} handlers={handlers} />
    </div>
  );
}

/* ================== SUJETS D'ENTRAÎNEMENT ================== */

function TrainingView({ progress, handlers, go, initialSubject, initialOpen }) {
  const [subj, setSubj] = useState(initialSubject || "all");
  const [open, setOpen] = useState(initialOpen || null);
  if (open) {
    const sujet = SUJETS.find((t) => t.id === open);
    return <TrainingRunner sujet={sujet} back={() => setOpen(null)} timed={false} go={go} />;
  }
  const filtered = subj === "all" ? SUJETS : SUJETS.filter((t) => t.subject === subj);
  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Annales & sujets d'entraînement</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 13 }}>
        {ANNALES.length} vrais partiels (dont 3 DS d'électronique) + {TRAINING.length} sujets inédits,
        avec correction détaillée, barème, conseils et erreurs fréquentes.
      </p>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 5, marginBottom: 14 }}>
        <button onClick={() => setSubj("all")} style={chip(T.txt, subj === "all")}>Toutes</button>
        {SUBJECTS.map((s) => (
          <button key={s.id} onClick={() => setSubj(s.id)} style={chip(s.color, subj === s.id)}>{s.name}</button>
        ))}
      </div>
      {subj === "elec" && (
        <div style={{
          background: `${T.green}12`, border: `1px solid ${T.green}55`, borderRadius: 11,
          padding: "11px 13px", marginBottom: 12,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: T.green, marginBottom: 4 }}>
            ✓ 3 annales d'électronique disponibles
          </div>
          <p style={{ fontSize: 12, color: T.dim, lineHeight: 1.55, margin: "0 0 9px" }}>
            Les DS1 et DS2 Électronique S2 2021-2022, et le DS2 2020-2021, sont intégrés ci-dessous,
            avec correction retranscrite des copies manuscrites. Les autres entrées « elec » sont des sujets
            d'entraînement inédits.
          </p>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            <button onClick={() => go({ view: "dselec" })} style={primBtn(T.green)}>
              ◈ DS Électronique corrigés
            </button>
            <button onClick={() => go({ view: "entrainementelec" })} style={ghostBtn()}>
              ✎ Entraînement électronique
            </button>
          </div>
        </div>
      )}
      {filtered.map((t) => {
        const sj = subjectById(t.subject);
        return (
          <div key={t.id} onClick={() => setOpen(t.id)}
            style={{
              background: T.bg2, border: `1px solid ${T.line}`,
              borderLeft: `3px solid ${sj.color}`, borderRadius: 11,
              padding: "13px 15px", marginBottom: 9, cursor: "pointer",
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13.3, fontWeight: 700, color: T.txt }}>
                {t.title}
              </div>
              <DiffBadge d={t.level} />
            </div>
            <div style={{ display: "flex", gap: 7, marginTop: 6, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 10.5, color: T.faint, fontFamily: "'JetBrains Mono', monospace" }}>⏱ {t.duration} min</span>
              <span style={{ fontSize: 10.5, color: T.faint, fontFamily: "'JetBrains Mono', monospace" }}>/ {t.bareme} pts</span>
              {t.tags.map((tag, i) => <span key={i} style={{ fontSize: 10, color: T.dim }}>#{tag}</span>)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============ MISE EN PAGE TYPE COPIE DE PARTIEL ============ */

function ExamHeader({ sujet, sj }) {
  const nbEx = sujet.parts.length;
  const nbQ = sujet.parts.reduce((n, p) => n + p.items.length, 0);
  const kicker = sujet.level === "reel" ? "SUJET D'ANNALE" : "PARTIEL BLANC";
  const meta = [
    ["Durée conseillée", sujet.duration + " min"],
    ["Barème total", "/ " + sujet.bareme],
    ["Exercices", String(nbEx)],
    ["Questions", String(nbQ)],
  ];
  return (
    <div style={{
      background: `linear-gradient(165deg, ${sj.color}14, ${T.bg2})`,
      border: `1px solid ${sj.color}55`, borderRadius: 13,
      padding: "16px 17px", marginBottom: 13,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 7 }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 800, letterSpacing: 1.4,
          color: sj.color, background: `${sj.color}1c`, border: `1px solid ${sj.color}55`,
          borderRadius: 5, padding: "3px 8px",
        }}>{kicker}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: sj.color }}>{sj.name}</span>
        <DiffBadge d={sujet.level} />
      </div>
      <h2 style={{ ...titleSt(20), margin: 0 }}>{sujet.title}</h2>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "7px 18px", marginTop: 10,
        paddingTop: 9, borderTop: `1px solid ${sj.color}33`,
      }}>
        {meta.map(([k, v], i) => (
          <div key={i}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.6, color: T.faint, letterSpacing: 0.6 }}>{k.toUpperCase()}</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800, color: T.txt }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{
        marginTop: 11, background: T.bg, border: `1px solid ${T.line}`,
        borderRadius: 9, padding: "9px 12px",
      }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.faint, letterSpacing: 1, marginBottom: 4 }}>CONSIGNES</div>
        <div style={{ fontSize: 11.7, color: T.dim, lineHeight: 1.6 }}>
          Justifie chaque réponse et encadre tes résultats. Les applications numériques
          doivent comporter une unité. Le barème est indicatif : sers-t'en pour doser ton
          temps. Traite les exercices dans l'ordre que tu veux.
        </div>
      </div>
      {sujet.tags && sujet.tags.length > 0 && (
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.faint, letterSpacing: 1, margin: "11px 0 5px" }}>
            CHAPITRES ÉVALUÉS
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {sujet.tags.map((t, i) => (
              <span key={i} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10.3, color: sj.color,
                background: `${sj.color}16`, border: `1px solid ${sj.color}3a`,
                borderRadius: 6, padding: "3px 8px",
              }}>{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExamExercise({ part, sj }) {
  const totalPts = part.items.reduce((s, it) => s + (parseFloat(it.pts) || 0), 0);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      margin: "22px 0 11px", padding: "10px 13px",
      background: T.bg3, borderRadius: 9, border: `1px solid ${T.line}`,
      borderLeft: `3px solid ${sj.color}`,
    }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 13.5, fontWeight: 800,
        color: sj.color, lineHeight: 1.4,
      }}>{part.title}</span>
      {totalPts > 0 && (
        <span style={{
          marginLeft: "auto", fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          fontWeight: 700, color: T.amber, background: `${T.amber}14`,
          border: `1px solid ${T.amber}3a`, borderRadius: 6, padding: "3px 9px", whiteSpace: "nowrap",
        }}>{totalPts} pts</span>
      )}
    </div>
  );
}

function ExamQuestion({ n, pts, sj, big, checked, onCheck, revoir, onRevoir, children }) {
  const accent = revoir ? T.coral : big ? sj.color : T.line;
  return (
    <div style={{
      background: T.bg2, borderRadius: 11, marginBottom: 11, overflow: "hidden",
      border: `1px solid ${revoir ? T.coral + "55" : big ? sj.color + "44" : T.line}`,
      borderLeft: `3px solid ${accent}`,
      opacity: checked ? 0.74 : 1,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
        background: T.bg3, borderBottom: `1px solid ${T.line}`, flexWrap: "wrap",
      }}>
        <button onClick={onCheck} title="Marquer comme fait" style={{
          width: 20, height: 20, borderRadius: 5, flexShrink: 0, cursor: "pointer",
          background: checked ? T.green : "transparent",
          border: `1.6px solid ${checked ? T.green : T.faint}`,
          color: T.bg, fontSize: 12, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>{checked ? "✓" : ""}</button>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.5, fontWeight: 800, color: T.txt }}>
          Question {n}
        </span>
        {big && (
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, fontWeight: 700, color: sj.color,
            background: `${sj.color}1c`, border: `1px solid ${sj.color}44`, borderRadius: 4, padding: "1px 5px",
          }}>CLÉ</span>
        )}
        <button onClick={onRevoir} title="Marquer cette question à revoir" style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9.3, fontWeight: 700, cursor: "pointer",
          color: revoir ? T.coral : T.faint,
          background: revoir ? `${T.coral}1a` : "transparent",
          border: `1px solid ${revoir ? T.coral + "55" : T.line}`,
          borderRadius: 5, padding: "2px 7px",
        }}>{revoir ? "★ à revoir" : "☆ à revoir"}</button>
        <span style={{
          marginLeft: "auto", fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 800,
          color: T.amber, background: `${T.amber}14`, border: `1px solid ${T.amber}3a`,
          borderRadius: 6, padding: "3px 9px", whiteSpace: "nowrap",
        }}>{pts}</span>
      </div>
      <div style={{ padding: "12px 14px" }}>{children}</div>
    </div>
  );
}

function ExamCorrection({ blocks, fiches, go }) {
  return (
    <div style={{
      background: "rgba(95,207,142,0.06)", border: `1px solid ${T.green}38`,
      borderRadius: 9, padding: "10px 13px", marginTop: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 7 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: T.green, flexShrink: 0 }} />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 800,
          letterSpacing: 1, color: T.green,
        }}>CORRECTION DÉTAILLÉE</span>
      </div>
      {blocks.map((b, i) => <Block key={i} b={b} color={T.green} />)}
      {fiches && fiches.length > 0 && (
        <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px solid ${T.green}26` }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: T.faint, letterSpacing: 1, marginBottom: 5 }}>
            FICHE À REVOIR SI BESOIN
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {fiches.map((fid) => {
              const f = ALL_FICHES.find((x) => x.id === fid);
              if (!f) return null;
              return (
                <button key={fid} onClick={() => go && go({ view: "subject", id: f.subject, fiche: f.id })}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.green,
                    background: `${T.green}14`, border: `1px solid ${T.green}40`,
                    borderRadius: 6, padding: "3px 8px", cursor: go ? "pointer" : "default",
                  }}>{f.title} ›</button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function TrainingRunner({ sujet, back, timed, onQuit, onComplete, go }) {
  const sj = subjectById(sujet.subject);
  const [reveal, setReveal] = useState({});   // itemKey -> {indice, corr}
  const [seconds, setSeconds] = useState(0);
  const [finished, setFinished] = useState(false);
  const [mode, setMode] = useState("entrainement"); // entrainement | sujet | correction
  const [checks, setChecks] = useState({});
  const [revoir, setRevoir] = useState({});
  const totalQ = sujet.parts.reduce((n, p) => n + p.items.length, 0);
  const doneQ = Object.values(checks).filter(Boolean).length;
  const revoirQ = Object.values(revoir).filter(Boolean).length;
  const topRef = useRef(null);
  useEffect(() => { if (topRef.current) topRef.current.scrollIntoView({ block: "start" }); }, [finished]);
  useEffect(() => {
    if (!timed || finished) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [timed, finished]);

  function fmt(s) {
    const m = Math.floor(s / 60), ss = s % 60;
    return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  }
  function setKey(key, field) {
    setReveal((r) => ({ ...r, [key]: { ...(r[key] || {}), [field]: true } }));
  }

  if (finished) {
    return (
      <div ref={topRef}>
        <BackBar onBack={onQuit || back} label="Retour" />
        <div style={{
          background: `linear-gradient(130deg, ${sj.color}1e, ${T.bg2})`,
          border: `1px solid ${sj.color}55`, borderRadius: 14, padding: "22px 18px",
          textAlign: "center", marginBottom: 14,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, letterSpacing: 1.5, color: sj.color }}>
            PARTIEL BLANC TERMINÉ
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 30, fontWeight: 800, color: T.txt, margin: "6px 0" }}>
            {fmt(seconds)}
          </div>
          <div style={{ fontSize: 12, color: T.dim }}>temps passé · barème /{sujet.bareme} · durée conseillée {sujet.duration} min</div>
        </div>

        <div style={panelSt()}>
          <PanelLabel color={sj.color}>Bilan — notions à retravailler</PanelLabel>
          <p style={{ fontSize: 12.7, color: T.dim, lineHeight: 1.55, margin: "0 0 8px" }}>
            Ce sujet portait sur les chapitres suivants. Reprends les fiches et exercices correspondants
            pour les questions où tu as hésité :
          </p>
          {revoirQ > 0 && (
            <p style={{
              fontSize: 12.3, color: T.coral, lineHeight: 1.5, margin: "0 0 8px",
              fontFamily: "'JetBrains Mono', monospace",
            }}>★ Tu as marqué {revoirQ} question{revoirQ > 1 ? "s" : ""} « à revoir » — repasse dessus en priorité.</p>
          )}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {sujet.tags.map((t, i) => (
              <span key={i} style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: sj.color,
                background: `${sj.color}1a`, border: `1px solid ${sj.color}44`,
                borderRadius: 7, padding: "5px 10px",
              }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={panelSt()}>
          <PanelLabel color={T.coral}>Erreurs fréquentes à vérifier</PanelLabel>
          <ul style={{ margin: 0, paddingLeft: 4, listStyle: "none" }}>
            {sujet.erreurs.map((e, i) => (
              <li key={i} style={{
                fontSize: 12.7, color: T.txt, lineHeight: 1.55, margin: "5px 0",
                paddingLeft: 18, position: "relative",
              }}>
                <span style={{ position: "absolute", left: 0, color: T.coral }}>✗</span>{e}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ display: "flex", gap: 9 }}>
          <button onClick={() => { setFinished(false); setSeconds(0); setReveal({}); setChecks({}); setRevoir({}); }} style={{ ...ghostBtn(), flex: 1 }}>
            Refaire ce sujet
          </button>
          <button onClick={onQuit || back} style={{ ...primBtn(sj.color), flex: 1 }}>Terminer</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={topRef}>
      <BackBar onBack={onQuit || back} label="Retour" />

      {timed && (
        <div style={{
          position: "sticky", top: 54, zIndex: 8, background: T.bg3,
          border: `1px solid ${sj.color}55`, borderRadius: 10, padding: "9px 14px",
          marginBottom: 12, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: T.faint, letterSpacing: 1 }}>CHRONOMÈTRE</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 800, color: sj.color }}>{fmt(seconds)}</div>
          </div>
          <div style={{ fontSize: 10.5, color: T.dim, textAlign: "right", lineHeight: 1.4 }}>
            conseillé<br />{sujet.duration} min
          </div>
        </div>
      )}

      <ExamHeader sujet={sujet} sj={sj} />

      <div style={{
        background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 11,
        padding: "11px 13px", marginBottom: 12,
      }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: T.faint, letterSpacing: 1, marginBottom: 6 }}>
          MODE D'AFFICHAGE
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
          {[
            { id: "sujet", l: "Sujet" },
            { id: "entrainement", l: "Entraînement" },
            { id: "correction", l: "Correction" },
          ].map((m) => (
            <button key={m.id} onClick={() => setMode(m.id)} style={chip(sj.color, mode === m.id)}>{m.l}</button>
          ))}
        </div>
        <div style={{ fontSize: 10.8, color: T.dim, lineHeight: 1.45, marginBottom: 9 }}>
          {mode === "sujet" && "Énoncés seuls, comme en conditions d'examen — corrections masquées."}
          {mode === "entrainement" && "Indices et corrections révélables question par question."}
          {mode === "correction" && "Toutes les corrections sont affichées (révision)."}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{ flex: 1, height: 8, background: T.bg, borderRadius: 5, overflow: "hidden" }}>
            <div style={{
              width: `${totalQ ? (doneQ / totalQ) * 100 : 0}%`, height: "100%",
              background: sj.color, transition: "width 0.25s",
            }} />
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.dim, whiteSpace: "nowrap" }}>
            {doneQ}/{totalQ} faites
          </span>
          {revoirQ > 0 && (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: T.coral, whiteSpace: "nowrap" }}>
              ★ {revoirQ} à revoir
            </span>
          )}
        </div>
      </div>

      {sujet.revision && (
        <div style={{
          background: T.bg2, border: `1px solid ${sj.color}44`, borderRadius: 12,
          padding: "13px 15px", marginBottom: 13,
        }}>
          <PanelLabel color={sj.color}>Comment réviser cette annale</PanelLabel>
          <div style={{ fontSize: 12.7, color: T.txt, lineHeight: 1.6 }}>
            <p style={{ margin: "0 0 6px" }}><strong style={{ color: sj.color }}>Ce que ce sujet évalue — </strong>{sujet.revision.evalue}</p>
            <p style={{ margin: "0 0 6px" }}><strong style={{ color: T.coral }}>Ce qui tombe souvent — </strong>{sujet.revision.tombe}</p>
            <p style={{ margin: "0 0 8px" }}><strong style={{ color: T.green }}>Comment le réviser — </strong>{sujet.revision.comment}</p>
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.faint, margin: "4px 0 4px" }}>
            FICHES À REVOIR AVANT
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
            {sujet.revision.fiches.map((fid) => {
              const f = ALL_FICHES.find((x) => x.id === fid);
              if (!f) return null;
              return (
                <button key={fid} onClick={() => go && go({ view: "subject", id: f.subject, fiche: f.id })}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: sj.color,
                    background: `${sj.color}1a`, border: `1px solid ${sj.color}44`,
                    borderRadius: 6, padding: "4px 8px", cursor: go ? "pointer" : "default",
                  }}>{f.title} ›</button>
              );
            })}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.faint, margin: "0 0 4px" }}>
            EXERCICES SIMILAIRES À FAIRE APRÈS
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {sujet.revision.exos.map((eid) => {
              const e = EXOS.find((x) => x.id === eid);
              if (!e) return null;
              return (
                <button key={eid} onClick={() => go && go({ view: "exos" })}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: T.amber,
                    background: `${T.amber}14`, border: `1px solid ${T.amber}44`,
                    borderRadius: 6, padding: "4px 8px", cursor: go ? "pointer" : "default",
                  }}>{e.title} ›</button>
              );
            })}
          </div>
        </div>
      )}

      {sujet.parts.map((part, pi) => (
        <div key={pi}>
          <ExamExercise part={part} sj={sj} />
          {part.items.map((it) => {
            const key = `${pi}-${it.n}`;
            const r = reveal[key] || {};
            const forced = mode === "correction";
            const showInd = r.indice || forced;
            const showCorr = r.corr || forced;
            const checked = !!checks[key];
            const isRevoir = !!revoir[key];
            const big = parseFloat(it.pts) >= 3;
            const term = sujet.subject === "info" ? SUJET_Q_TERMINAL[sujet.id + ":" + it.n] : null;
            return (
              <ExamQuestion key={key} n={it.n} pts={it.pts} sj={sj} big={big}
                checked={checked} onCheck={() => setChecks((c) => ({ ...c, [key]: !c[key] }))}
                revoir={isRevoir} onRevoir={() => setRevoir((c) => ({ ...c, [key]: !c[key] }))}>
                <div style={{ fontSize: 13.3, color: T.txt, lineHeight: 1.62 }}>
                  {it.q.map((b, j) => <Block key={j} b={b} color={sj.color} />)}
                </div>

                {term ? (
                  <>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: T.cyan,
                      letterSpacing: 0.8, marginTop: 11,
                    }}>▶ RÉPONDRE DANS LE TERMINAL</div>
                    <TerminalCodePractice
                      storageKey={"ece-ans-" + sujet.id + "-" + it.n}
                      funcName={term.func}
                      criteria={term.criteres}
                      indice={it.indice}
                      correctionBlocks={it.c}
                      fiches={sujet.revision && sujet.revision.fiches}
                      go={go}
                      forceCorrection={mode === "correction"} />
                  </>
                ) : (
                  <>
                    {mode === "entrainement" && (!showInd || !showCorr) && (
                      <div style={{
                        display: "flex", gap: 8, marginTop: 11, flexWrap: "wrap",
                        paddingTop: 10, borderTop: `1px solid ${T.line}`,
                      }}>
                        {!showInd && it.indice && (
                          <button onClick={() => setKey(key, "indice")} style={ghostBtn()}>💡 Voir l'indice</button>
                        )}
                        {!showCorr && (
                          <button onClick={() => setKey(key, "corr")} style={primBtn(sj.color)}>Voir la correction</button>
                        )}
                      </div>
                    )}

                    {showInd && it.indice && (
                      <div style={{
                        background: "rgba(232,200,74,0.08)", border: `1px solid ${T.yellow}44`,
                        borderRadius: 9, padding: "9px 12px", marginTop: 10,
                      }}>
                        <PanelLabel color={T.yellow}>Indice</PanelLabel>
                        <div style={{ fontSize: 12.7, color: T.txt, lineHeight: 1.55 }}>{it.indice}</div>
                      </div>
                    )}
                    {showCorr && (
                      <ExamCorrection blocks={it.c} fiches={sujet.revision && sujet.revision.fiches} go={go} />
                    )}
                  </>
                )}
              </ExamQuestion>
            );
          })}
        </div>
      ))}

      <div style={panelSt()}>
        <PanelLabel color={T.cyan}>Conseils de méthode</PanelLabel>
        <ul style={{ margin: 0, paddingLeft: 4, listStyle: "none" }}>
          {sujet.conseils.map((c, i) => (
            <li key={i} style={{ fontSize: 12.7, color: T.txt, lineHeight: 1.55, margin: "5px 0", paddingLeft: 18, position: "relative" }}>
              <span style={{ position: "absolute", left: 0, color: T.cyan, fontWeight: 700 }}>›</span>{c}
            </li>
          ))}
        </ul>
      </div>
      <div style={panelSt()}>
        <PanelLabel color={T.coral}>Erreurs fréquentes</PanelLabel>
        <ul style={{ margin: 0, paddingLeft: 4, listStyle: "none" }}>
          {sujet.erreurs.map((e, i) => (
            <li key={i} style={{ fontSize: 12.7, color: T.txt, lineHeight: 1.55, margin: "5px 0", paddingLeft: 18, position: "relative" }}>
              <span style={{ position: "absolute", left: 0, color: T.coral }}>✗</span>{e}
            </li>
          ))}
        </ul>
      </div>

      {timed && (
        <button onClick={() => { setFinished(true); if (onComplete) onComplete(); }} style={{ ...primBtn(sj.color), width: "100%" }}>
          Terminer le partiel blanc
        </button>
      )}
    </div>
  );
}

/* ================== PARTIEL BLANC ================== */

function PartielBlancView({ go, handlers }) {
  const [subj, setSubj] = useState(null);
  const [sujetId, setSujetId] = useState(null);

  if (sujetId) {
    const sujet = SUJETS.find((t) => t.id === sujetId);
    return <TrainingRunner sujet={sujet} timed={true} back={() => setSujetId(null)} onQuit={() => setSujetId(null)} onComplete={() => handlers.markPartiel(sujet.id)} />;
  }

  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Partiel blanc</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 16 }}>
        Choisis une matière puis un sujet : un chronomètre se lance, tu composes, et à la fin tu obtiens
        le corrigé complet et le bilan des notions à retravailler.
      </p>

      {!subj ? (
        <>
          <SectionLabel>1 · Choisis la matière</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 10 }}>
            {SUBJECTS.map((s) => (
              <div key={s.id} onClick={() => setSubj(s.id)}
                style={{
                  background: T.bg2, border: `1px solid ${T.line}`, borderLeft: `3px solid ${s.color}`,
                  borderRadius: 11, padding: "15px 14px", cursor: "pointer",
                }}>
                <div style={{ fontSize: 19, color: s.color, fontFamily: "'JetBrains Mono', monospace", fontWeight: 800 }}>{s.glyph}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13.5, fontWeight: 700, color: T.txt, marginTop: 6 }}>{s.name}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <button onClick={() => setSubj(null)} style={{ ...ghostBtn(), marginBottom: 12 }}>‹ Changer de matière</button>
          <SectionLabel>2 · Choisis le sujet</SectionLabel>
          {sujetsOf(subj).map((t) => (
            <div key={t.id} onClick={() => setSujetId(t.id)}
              style={{
                background: T.bg2, border: `1px solid ${T.line}`,
                borderLeft: `3px solid ${subjectById(subj).color}`, borderRadius: 11,
                padding: "13px 15px", marginBottom: 9, cursor: "pointer",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: T.txt }}>{t.title}</div>
                <DiffBadge d={t.level} />
              </div>
              <div style={{ fontSize: 11, color: T.faint, fontFamily: "'JetBrains Mono', monospace", marginTop: 5 }}>
                ⏱ {t.duration} min · /{t.bareme} pts
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* ================== DOCUMENTS ================== */

function DocList({ docs, go }) {
  const [open, setOpen] = useState(null);
  const order = ["Cours", "Fiche", "TD", "TP", "Partiel", "Correction"];
  const impColor = { essentiel: T.coral, utile: T.amber, bonus: T.faint };

  if (open) {
    const doc = docs.find((d) => d.name === open) || DOCS.find((d) => d.name === open);
    return <DocReader doc={doc} back={() => setOpen(null)} go={go} />;
  }

  const grouped = order.map((type) => ({ type, items: docs.filter((d) => d.type === type) })).filter((g) => g.items.length);
  return (
    <div>
      <SectionLabel>Documents du zip — {docs.length} fichiers · clique pour le détail</SectionLabel>
      {grouped.map((g) => (
        <div key={g.type} style={{ marginBottom: 13 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: T.dim, marginBottom: 6 }}>
            {g.type.toUpperCase()}
          </div>
          {g.items.map((d, i) => (
            <div key={i} onClick={() => setOpen(d.name)}
              style={{
                background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 10,
                padding: "11px 13px", marginBottom: 7, cursor: "pointer",
              }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
                <div style={{ fontSize: 13, color: T.txt, fontWeight: 600 }}>{d.name}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700,
                    color: impColor[d.importance], border: `1px solid ${impColor[d.importance]}66`,
                    borderRadius: 5, padding: "2px 6px", whiteSpace: "nowrap", textTransform: "uppercase",
                  }}>{d.importance}</span>
                  <span style={{ color: T.faint, fontSize: 15 }}>›</span>
                </div>
              </div>
              <div style={{ fontSize: 12, color: T.dim, lineHeight: 1.5, marginTop: 4 }}>{d.resume}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function DocReader({ doc, back, go }) {
  const sj = subjectById(doc.subject);
  const [copied, setCopied] = useState(false);
  const impColor = { essentiel: T.coral, utile: T.amber, bonus: T.faint };
  const topRef = useRef(null);
  useEffect(() => { if (topRef.current) topRef.current.scrollIntoView({ block: "start" }); }, []);

  function copyPath() {
    try {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(doc.path);
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      }
    } catch (e) { /* presse-papier indisponible */ }
  }

  return (
    <div ref={topRef}>
      <BackBar onBack={back} label="Tous les documents" />
      <div style={{ borderLeft: `3px solid ${sj.color}`, paddingLeft: 13, marginBottom: 13 }}>
        <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, color: sj.color, fontFamily: "'JetBrains Mono', monospace" }}>{sj.name} · {doc.type}</span>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700,
            color: impColor[doc.importance], border: `1px solid ${impColor[doc.importance]}66`,
            borderRadius: 5, padding: "2px 6px", textTransform: "uppercase",
          }}>{doc.importance}</span>
        </div>
        <h2 style={{ ...titleSt(19), marginTop: 5 }}>{doc.name}</h2>
      </div>

      <div style={panelSt()}>
        <PanelLabel color={sj.color}>Emplacement dans ton zip</PanelLabel>
        <p style={{ fontSize: 12.3, color: T.dim, lineHeight: 1.55, margin: "0 0 7px" }}>
          Ouvre ce fichier depuis ton archive <strong style={{ color: T.txt }}>RevisionECE.zip</strong>, à ce chemin :
        </p>
        <CodeBlock code={doc.path} color={sj.color} />
        <button onClick={copyPath} style={{ ...ghostBtn(), marginTop: 2 }}>
          {copied ? "✓ Chemin copié" : "⎘ Copier le chemin"}
        </button>
      </div>

      <div style={panelSt()}>
        <PanelLabel color={T.cyan}>Contenu du document</PanelLabel>
        <p style={{ fontSize: 13.3, color: T.txt, lineHeight: 1.65, margin: 0 }}>{doc.detail}</p>
      </div>

      <div style={panelSt()}>
        <PanelLabel color={T.green}>Exploité dans le site</PanelLabel>
        <p style={{ fontSize: 12.5, color: T.dim, lineHeight: 1.55, margin: "0 0 9px" }}>
          Le contenu de ce document a servi à construire les fiches, exercices et quiz de la matière.
        </p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button onClick={() => go({ view: "subject", id: doc.subject })} style={primBtn(sj.color)}>
            Voir les fiches · {sj.name}
          </button>
          {doc.annale && (
            <button onClick={() => go({ view: "training", subject: doc.subject, open: doc.annale })}
              style={{ ...primBtn(T.pink) }}>
            ★ Ouvrir l'annale jouable
            </button>
          )}
        </div>
      </div>

      <Callout kind="info" title="Pourquoi pas d'ouverture directe ?">
        Ce site est une page web : pour des raisons de sécurité, le navigateur l'empêche d'ouvrir des fichiers
        de ton ordinateur. Le PDF d'origine s'ouvre donc depuis ton dossier RevisionECE.zip, au chemin indiqué ci-dessus.
      </Callout>
    </div>
  );
}

/* ================== RÉVISION RAPIDE ================== */

const PARCOURS = {
  30: [
    { s: "math", t: "Mémoriser les DL usuels", d: "eˣ, ln(1+x), sin, cos — fiche Développements limités." },
    { s: "elec", t: "Diviseur de tension + lois", d: "U₂ = U·R₂/(R₁+R₂) ; lois de Kirchhoff." },
    { s: "info", t: "Schéma de la chaîne dynamique", d: "fgets → malloc(strlen+1) → strcpy. Ordre de libération." },
    { s: "meca", t: "TEC et conservation de Em", d: "ΔEc = ΣW ; Em conservée sans frottement." },
    { s: "all", t: "Quiz éclair", d: "Faire 1 quiz par matière en diagonale." },
  ],
  60: [
    { s: "info", t: "Fiches piles, files, listes", d: "FIFO/LIFO, double ancrage, parcours." },
    { s: "info", t: "Exo : inverser une file", d: "L'exercice qui tombe le plus souvent." },
    { s: "math", t: "Fiches DL + intégrales", d: "Critères de Riemann, recette du DL." },
    { s: "math", t: "Exo : nature d'une intégrale", d: "Équivalent + comparaison à Riemann." },
    { s: "meca", t: "Oscillateur harmonique", d: "ẍ + ω₀²x = 0, pulsation propre." },
    { s: "elec", t: "Filtres RC + AOP", d: "Fonction de transfert, fréquence de coupure." },
    { s: "all", t: "Flashcards des 4 matières", d: "Passer toutes les cartes « formules »." },
  ],
  120: [
    { s: "info", t: "Toutes les fiches d'informatique", d: "Pointeurs → Allegro, en marquant « à revoir »." },
    { s: "info", t: "Sujet d'entraînement Info nº2", d: "Niveau difficile : listes, récursivité, analyse." },
    { s: "math", t: "Toutes les fiches de maths", d: "DL, intégrales, matrices, déterminants." },
    { s: "math", t: "Sujet d'entraînement Maths nº2", d: "Matrices, déterminants, intégrales." },
    { s: "meca", t: "Fiches énergie + oscillations", d: "TEC, TEM, oscillateur amorti." },
    { s: "meca", t: "Sujet d'entraînement Méca nº2", d: "Oscillateurs amortis, mise en équation." },
    { s: "elec", t: "Fiches circuits + filtres + AOP", d: "Lois, diviseur, Bode, montages AOP." },
    { s: "elec", t: "Sujet d'entraînement Élec nº2", d: "Filtres et amplificateur opérationnel." },
    { s: "all", t: "Mode Partiel + un partiel blanc", d: "Quiz global puis un sujet chronométré." },
  ],
};

function ExpressView({ go }) {
  const [dur, setDur] = useState(60);
  const steps = PARCOURS[dur];
  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Révision rapide</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 14 }}>
        « J'ai partiel bientôt. » Choisis le temps dont tu disposes : le site te donne un parcours ciblé.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[{ v: 30, l: "30 min" }, { v: 60, l: "1 heure" }, { v: 120, l: "2 heures" }].map((o) => (
          <button key={o.v} onClick={() => setDur(o.v)}
            style={{
              flex: 1, background: dur === o.v ? T.coral : T.bg2,
              color: dur === o.v ? T.bg : T.dim,
              border: `1px solid ${dur === o.v ? T.coral : T.line}`, borderRadius: 10,
              padding: "11px", cursor: "pointer", fontFamily: "'JetBrains Mono', monospace",
              fontSize: 13, fontWeight: 800,
            }}>{o.l}</button>
        ))}
      </div>

      <SectionLabel>Parcours conseillé — {dur === 120 ? "2 heures" : dur === 60 ? "1 heure" : "30 minutes"}</SectionLabel>
      {steps.map((st, i) => {
        const sj = st.s === "all" ? null : subjectById(st.s);
        return (
          <div key={i}
            onClick={() => { if (sj) go({ view: "subject", id: st.s }); else go({ view: "quiz" }); }}
            style={{
              background: T.bg2, border: `1px solid ${T.line}`,
              borderLeft: `3px solid ${sj ? sj.color : T.coral}`, borderRadius: 11,
              padding: "12px 14px", marginBottom: 8, cursor: "pointer",
              display: "flex", alignItems: "center", gap: 12,
            }}>
            <div style={{
              width: 26, height: 26, borderRadius: 8, flexShrink: 0,
              background: `${sj ? sj.color : T.coral}1e`,
              border: `1px solid ${sj ? sj.color : T.coral}55`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 800,
              color: sj ? sj.color : T.coral,
            }}>{i + 1}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.2, color: T.txt, fontWeight: 600 }}>{st.t}</div>
              <div style={{ fontSize: 11.7, color: T.dim, marginTop: 1 }}>{st.d}</div>
            </div>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: sj ? sj.color : T.coral,
            }}>{sj ? sj.name.toUpperCase() : "GLOBAL"}</span>
          </div>
        );
      })}

      <div style={{ display: "flex", gap: 9, marginTop: 6 }}>
        <button onClick={() => go({ view: "flashcards" })} style={{ ...ghostBtn(), flex: 1 }}>⮂ Flashcards</button>
        <button onClick={() => go({ view: "partielblanc" })} style={{ ...primBtn(T.coral), flex: 1 }}>⏱ Partiel blanc</button>
      </div>
    </div>
  );
}

/* ================== RECHERCHE GLOBALE ================== */

function PartielSoonView({ go }) {
  const plans = [
    { t: "30 minutes", c: T.coral, sub: "Mode urgence — l'essentiel",
      steps: [
        "Lis les formules essentielles de la matière (8 min)",
        "Survole les erreurs fréquentes à éviter (6 min)",
        "Fais un quiz rapide pour te jauger (8 min)",
        "Refais 1 exercice type sur le chapitre clé (8 min)",
      ] },
    { t: "1 heure", c: T.amber, sub: "Révision ciblée",
      steps: [
        "Relis les fiches des 2-3 chapitres qui tombent le plus (20 min)",
        "Apprends les formules clés avec leurs variables (12 min)",
        "Quiz + quiz formules de la matière (13 min)",
        "2-3 exercices corrigés prioritaires (15 min)",
      ] },
    { t: "2 heures", c: T.green, sub: "Révision complète",
      steps: [
        "Relis toutes les fiches de la matière (40 min)",
        "Parcours le formulaire complet avec les exemples (20 min)",
        "Fais tous les quiz de la matière (20 min)",
        "Termine par un partiel blanc chronométré (40 min)",
      ] },
  ];
  const links = [
    { l: "Formules essentielles", d: "Le formulaire complet, rendu proprement", i: "∑", c: T.yellow, v: "formules" },
    { l: "Erreurs fréquentes", d: "Les pièges à ne surtout pas refaire", i: "✗", c: T.coral, v: "erreurs" },
    { l: "Quiz rapide", d: "Teste-toi vite sur la matière", i: "✓", c: T.green, v: "quiz" },
    { l: "Quiz formules", d: "Mémorise les formules clés", i: "⊕", c: T.cyan, v: "formulesquiz" },
    { l: "Exercices prioritaires", d: "Exos corrigés à refaire en priorité", i: "✎", c: T.amber, v: "exos" },
    { l: "Partiel blanc", d: "Sujet chronométré + bilan", i: "⏱", c: T.blue, v: "partielblanc" },
    { l: "DS Électronique corrigés", d: "Les 3 vrais DS d'élec, corrigés", i: "⏚", c: T.green, v: "dselec" },
    { l: "Ce qui tombe souvent", d: "Chapitres et pièges récurrents", i: "◆", c: T.violet, v: "tombe" },
    { l: "Méthodes de partiel", d: "Gérer l'énoncé, le temps, la copie", i: "✓", c: T.green, v: "methodespartiel" },
  ];
  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>J'ai partiel bientôt</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 15, lineHeight: 1.5 }}>
        Pas de panique. Choisis un plan selon le temps qu'il te reste, puis enchaîne avec les
        raccourcis ci-dessous. Tout est déjà prêt.
      </p>

      {plans.map((p) => (
        <div key={p.t} style={{
          background: `linear-gradient(135deg, ${p.c}1a, ${T.bg2})`,
          border: `1px solid ${p.c}55`, borderRadius: 13, padding: "14px 16px", marginBottom: 11,
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 9, marginBottom: 8 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 17, fontWeight: 800, color: p.c,
            }}>{p.t}</span>
            <span style={{ fontSize: 11.5, color: T.dim }}>{p.sub}</span>
          </div>
          {p.steps.map((st, i) => (
            <div key={i} style={{ display: "flex", gap: 9, alignItems: "flex-start", margin: "5px 0" }}>
              <span style={{
                width: 18, height: 18, borderRadius: 5, flexShrink: 0, marginTop: 1,
                background: `${p.c}26`, color: p.c, fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
              }}>{i + 1}</span>
              <span style={{ fontSize: 12.7, color: T.txt, lineHeight: 1.5 }}>{st}</span>
            </div>
          ))}
        </div>
      ))}

      <SectionLabel>Accès rapide avant le partiel</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(165px,1fr))", gap: 9 }}>
        {links.map((k) => (
          <button key={k.l} onClick={() => go({ view: k.v })} className="ece-card"
            style={{
              display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 3,
              background: T.bg2, border: `1px solid ${k.c}44`, borderRadius: 12,
              padding: "12px 13px", cursor: "pointer", textAlign: "left",
            }}>
            <span style={{
              width: 31, height: 31, borderRadius: 8, background: `${k.c}20`,
              border: `1px solid ${k.c}55`, color: k.c, fontSize: 14, marginBottom: 4,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>{k.i}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12.3, fontWeight: 800, color: T.txt }}>{k.l}</span>
            <span style={{ fontSize: 10.8, color: T.dim, lineHeight: 1.4, fontFamily: "'Spectral', serif" }}>{k.d}</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 14 }}>
        <Callout kind="tip" title="Le bon réflexe">
          Avant le partiel : formules d'abord, puis erreurs fréquentes, puis un quiz pour te jauger.
          Tu retiens mieux en te testant qu'en relisant passivement.
        </Callout>
      </div>
    </div>
  );
}

const TOMBE_ELEC = [
  { t: "Thévenin / Norton", v: "Calculer Rth (sources indépendantes éteintes), Eth à vide, In en court-circuit, puis le courant dans la charge par diviseur de courant." },
  { t: "Sources liées", v: "Calculer Rth en injectant un générateur de test — la source liée reste active, on ne l'éteint jamais." },
  { t: "Théorème de Millman", v: "Trouver le potentiel d'un nœud, puis en déduire le courant d'une branche par la loi d'Ohm." },
  { t: "Méthode des nœuds", v: "Mettre un circuit à plusieurs potentiels inconnus en équations, puis résoudre le système." },
  { t: "AOP en régime linéaire", v: "Justifier le régime linéaire (V+ = V−) et calculer la tension de sortie via Millman ou un diviseur de tension." },
  { t: "Trigger de Schmitt", v: "Déterminer les seuils VH et VL, tracer la caractéristique Vout = f(Vin), donner un exemple d'utilisation." },
  { t: "Filtres RC", v: "Donner les schémas équivalents BF/HF, en déduire la nature du filtre et la fonction de transfert H(jω)." },
  { t: "Diagrammes de Bode", v: "Tracer le gain et la phase asymptotiques, placer la pente ±20 dB/déc et le point −3 dB, calculer ωc." },
  { t: "Valeur moyenne / efficace", v: "Calculer ⟨s⟩ et S d'un signal créneau à partir de l'aire et de l'aire du carré du signal." },
  { t: "Séries de Fourier", v: "Exprimer les coefficients An/Bn et exploiter la parité du signal (Bn = 0 si pair, An = 0 si impair)." },
  { t: "Condensateur de découplage", v: "Nommer et expliquer le rôle du condensateur d'un filtre passe-bas : il dérive les hautes fréquences vers la masse." },
];

function DSElecView({ go }) {
  const ids = ["a-elec-1", "a-elec-2", "a-elec-3"];
  const diffMap = { "a-elec-1": "Difficile", "a-elec-2": "Moyen", "a-elec-3": "Moyen" };
  const ds = ids.map((id) => ANNALES.find((a) => a.id === id)).filter(Boolean);
  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>DS Électronique corrigés</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 14, lineHeight: 1.5 }}>
        3 vrais DS d'électronique S2, retranscrits fidèlement des copies corrigées manuscrites.
        Chaque exercice a sa méthode et sa correction guidée pas à pas.
      </p>
      {ds.map((d) => {
        const nEx = d.parts.length;
        return (
          <div key={d.id} className="ece-card"
            onClick={() => go({ view: "training", subject: "elec", open: d.id })}
            style={{
              background: `linear-gradient(135deg, ${T.green}14, ${T.bg2})`,
              border: `1px solid ${T.green}55`, borderRadius: 13, padding: "14px 15px",
              marginBottom: 11, cursor: "pointer",
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start" }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13.2, fontWeight: 800, color: T.txt }}>
                {d.title}
              </div>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700,
                color: T.green, background: `${T.green}1e`, border: `1px solid ${T.green}55`,
                borderRadius: 6, padding: "3px 7px", whiteSpace: "nowrap",
              }}>ANNALE RÉELLE</span>
            </div>
            <div style={{ display: "flex", gap: 9, marginTop: 5, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10.5, color: T.faint, fontFamily: "'JetBrains Mono', monospace" }}>⏱ {d.duration} min</span>
              <span style={{ fontSize: 10.5, color: T.faint, fontFamily: "'JetBrains Mono', monospace" }}>/ {d.bareme} pts</span>
              <span style={{ fontSize: 10.5, color: T.faint, fontFamily: "'JetBrains Mono', monospace" }}>{nEx} exercices</span>
              <span style={{ fontSize: 10.5, color: T.amber, fontFamily: "'JetBrains Mono', monospace" }}>difficulté : {diffMap[d.id]}</span>
            </div>
            <div style={{ display: "flex", gap: 5, marginTop: 7, flexWrap: "wrap" }}>
              {d.tags.map((t, i) => (
                <span key={i} style={{
                  fontSize: 10, color: T.green, background: `${T.green}14`,
                  border: `1px solid ${T.green}33`, borderRadius: 5, padding: "2px 7px",
                }}>#{t}</span>
              ))}
            </div>
            <p style={{ fontSize: 11.7, color: T.dim, lineHeight: 1.5, margin: "8px 0 6px" }}>
              {d.revision.evalue}
            </p>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: T.faint, marginBottom: 3 }}>
              EXERCICES
            </div>
            {d.parts.map((p, i) => (
              <div key={i} style={{ fontSize: 11.3, color: T.txt, lineHeight: 1.45, marginBottom: 1 }}>
                · {p.title.replace(/^Exercice \d+ — /, "")}
              </div>
            ))}
            <div style={{ marginTop: 9 }}>
              <span style={{ ...primBtn(T.green), display: "inline-block" }}>Ouvrir le DS corrigé →</span>
            </div>
          </div>
        );
      })}
      <SectionLabel>Ce qui tombe souvent en DS Électronique</SectionLabel>
      <div style={{ background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 11, padding: "6px 13px 10px" }}>
        {TOMBE_ELEC.map((x, i) => (
          <div key={i} style={{
            padding: "8px 0",
            borderBottom: i < TOMBE_ELEC.length - 1 ? `1px solid ${T.line}` : "none",
          }}>
            <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
              <span style={{ color: T.amber, fontSize: 11 }}>◆</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: T.txt }}>{x.t}</span>
            </div>
            <p style={{ fontSize: 11.7, color: T.dim, lineHeight: 1.5, margin: "3px 0 0 19px" }}>{x.v}</p>
          </div>
        ))}
      </div>

      <SectionLabel>Aller plus loin</SectionLabel>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button onClick={() => go({ view: "entrainementelec" })} style={ghostBtn()}>✎ Exercices issus des DS</button>
        <button onClick={() => go({ view: "reconnaitreelec" })} style={ghostBtn()}>◆ Reconnaître un exercice</button>
        <button onClick={() => go({ view: "schemaselec" })} style={ghostBtn()}>⏚ Schémas d'électronique</button>
      </div>
    </div>
  );
}

function SchemasElecView({ go }) {
  const groups = [
    { t: "Lois fondamentales", names: ["ohm", "mailles", "noeuds", "diviseur", "thevenin", "norton"] },
    { t: "Amplificateur opérationnel", names: ["aop-ideal", "aop-inverseur", "aop-noninverseur", "aop-suiveur", "aop-comparateur", "aop-schmitt"] },
    { t: "Filtres", names: ["rc-passebas", "rc-passehaut", "decouplage"] },
    { t: "Diagrammes de Bode", names: ["bode-passebas", "bode-passehaut", "bode-passebande", "bode-coupebande"] },
  ];
  const labels = {
    ohm: "Loi d'Ohm", mailles: "Loi des mailles", noeuds: "Loi des nœuds", diviseur: "Diviseur de tension",
    thevenin: "Équivalent Thévenin", norton: "Équivalent Norton",
    "aop-ideal": "AOP idéal", "aop-inverseur": "Montage inverseur", "aop-noninverseur": "Montage non-inverseur",
    "aop-suiveur": "Suiveur", "aop-comparateur": "Comparateur saturé", "aop-schmitt": "Trigger de Schmitt",
    "rc-passebas": "Filtre RC passe-bas", "rc-passehaut": "Filtre RC passe-haut", "decouplage": "Condensateur de découplage",
    "bode-passebas": "Bode passe-bas", "bode-passehaut": "Bode passe-haut",
    "bode-passebande": "Bode passe-bande", "bode-coupebande": "Bode coupe-bande",
  };
  return (
    <div>
      <BackBar onBack={() => go({ view: "subject", id: "elec" })} label="Électronique" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Schémas d'électronique</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 14 }}>
        Tous les schémas pédagogiques du site, regroupés. On les retrouve aussi dans les fiches.
      </p>
      {groups.map((g) => (
        <div key={g.t} style={{ marginBottom: 14 }}>
          <SectionLabel>{g.t}</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 9 }}>
            {g.names.map((n) => (
              <div key={n} style={{
                background: T.bg2, border: `1px solid ${T.line}`, borderRadius: 10, padding: "8px 8px 6px",
              }}>
                <Schema name={n} />
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 10.3, color: T.dim,
                  textAlign: "center", marginTop: 4,
                }}>{labels[n]}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const RECO_ELEC = [
  { type: "Thévenin / Norton", c: T.green,
    rec: "On demande Rth/Eth (ou Rn/In), ou le courant/la tension dans une charge Rc qu'on peut isoler du reste du circuit.",
    met: "Rth : éteindre les sources indépendantes, calculer la résistance vue des bornes. Eth : tension à vide. In : courant de court-circuit. Rn = Rth.",
    pie: "Oublier d'éteindre une source, ou se tromper d'orientation pour In (souvent imposée A→B).",
    fo: "Diviseur de courant : io = Rn/(Rn+Rc) · In" },
  { type: "Sources liées", c: T.coral,
    rec: "Le circuit contient une source dont la valeur dépend d'une tension ou d'un courant du circuit (ex. 2io, U = io).",
    met: "On n'éteint JAMAIS une source liée. Pour Rth : éteindre les sources indépendantes et injecter un générateur de test → Rth = V/I.",
    pie: "Traiter la source liée comme une source indépendante et l'éteindre.",
    fo: "Rth = V_test / I_test" },
  { type: "Théorème de Millman", c: T.cyan,
    rec: "On cherche le potentiel d'UN seul nœud relié à plusieurs branches (résistances + sources).",
    met: "Sommer les V/R de chaque branche et les courants injectés, diviser par la somme des 1/R.",
    pie: "Se tromper de signe au numérateur selon l'orientation des sources ; oublier une branche.",
    fo: "VA = (Σ Vk/Rk + Σ Ik) / Σ (1/Rk)" },
  { type: "Théorème de superposition", c: T.violet,
    rec: "Plusieurs sources indépendantes, on demande une grandeur (souvent un potentiel) — parfois « 2 schémas attendus ».",
    met: "Garder une seule source active à la fois, calculer sa contribution, puis additionner toutes les contributions.",
    pie: "Oublier qu'une source de tension éteinte = court-circuit, une source de courant éteinte = circuit ouvert.",
    fo: "VA = VA1 + VA2 + … (une contribution par source)" },
  { type: "Méthode des nœuds", c: T.blue,
    rec: "On demande plusieurs potentiels (VA, VB, VC) en même temps.",
    met: "Une loi des nœuds par nœud inconnu, courants exprimés par la loi d'Ohm, puis résoudre le système.",
    pie: "Mauvais nombre d'équations : il en faut autant que de potentiels inconnus.",
    fo: "Loi des nœuds : Σ i_entrant = Σ i_sortant" },
  { type: "AOP en régime linéaire", c: T.green,
    rec: "L'AOP a une contre-réaction vers l'entrée − (montage inverseur, non-inverseur, suiveur).",
    met: "Régime linéaire → V+ = V− et i+ = i− = 0. Appliquer diviseur de tension, Millman ou loi des nœuds.",
    pie: "Écrire V+ = V− sans vérifier que la réaction est bien sur l'entrée −.",
    fo: "Inverseur : Vs = −(R2/R1)·Ve   ·   Non-inverseur : Vs = (1+R2/R1)·Ve" },
  { type: "AOP saturé / trigger de Schmitt", c: T.amber,
    rec: "Pas de contre-réaction sur −, ou réaction sur l'entrée + → comparateur ou trigger à hystérésis.",
    met: "Sortie saturée à ±Vsat. V+ se lit par diviseur de tension. Basculement quand V+ = V−.",
    pie: "Confondre VH et VL, ou oublier le facteur R1/(R1+R2).",
    fo: "VH = R1/(R1+R2)·Vsat   ·   VL = −R1/(R1+R2)·Vsat" },
  { type: "Filtres", c: T.cyan,
    rec: "Un circuit RC avec entrée Vin et sortie Vout ; on demande la nature du filtre ou H(jω).",
    met: "Comportement de C : basse fréquence = interrupteur ouvert, haute fréquence = fil. Pont diviseur pour H(jω).",
    pie: "Inverser le comportement du condensateur entre BF et HF.",
    fo: "Zc = 1/(jCω)   ·   H(jω) par pont diviseur de tension" },
  { type: "Diagrammes de Bode", c: T.yellow,
    rec: "On demande les diagrammes asymptotiques en gain (dB) et en phase, ou la pulsation de coupure ωc.",
    met: "Mettre H sous forme canonique, lire ω0/ω1, tracer les asymptotes à ±20 dB/décade.",
    pie: "Confondre la pente du gain et l'écart réel de −3 dB à la coupure.",
    fo: "G(dB) = 20·log|H|   ·   coupure : |H| = |H|max/√2" },
  { type: "Fourier / valeur moyenne / efficace", c: T.violet,
    rec: "Un signal périodique (souvent un créneau) ; on demande ⟨s⟩, S, ou les coefficients An/Bn.",
    met: "⟨s⟩ = aire/T. S = √(moyenne de s²). Exploiter la parité : signal pair → Bn = 0, signal impair → An = 0.",
    pie: "Confondre valeur moyenne et valeur efficace ; oublier d'élever au carré pour S.",
    fo: "S = √[(1/T)∫s²dt]   ·   An, Bn par intégration" },
];

function ReconnaitreElecView({ go }) {
  return (
    <div>
      <BackBar onBack={() => go({ view: "subject", id: "elec" })} label="Électronique" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Reconnaître l'exercice en électronique</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 14, lineHeight: 1.5 }}>
        Le réflexe le plus important en partiel : identifier le type d'exercice pour appliquer
        la bonne méthode. Voici les 10 cas du programme.
      </p>
      {RECO_ELEC.map((r) => (
        <div key={r.type} style={{
          background: T.bg2, border: `1px solid ${r.c}44`, borderLeft: `3px solid ${r.c}`,
          borderRadius: 11, padding: "12px 14px", marginBottom: 9,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800, color: r.c, marginBottom: 7 }}>
            {r.type}
          </div>
          {[
            { l: "Comment le reconnaître", v: r.rec, ic: "◆", ic_c: r.c },
            { l: "Méthode à appliquer", v: r.met, ic: "→", ic_c: T.green },
            { l: "Piège fréquent", v: r.pie, ic: "✗", ic_c: T.coral },
          ].map((row) => (
            <div key={row.l} style={{ display: "flex", gap: 8, margin: "5px 0" }}>
              <span style={{ color: row.ic_c, fontSize: 11, marginTop: 2, width: 12, flexShrink: 0, textAlign: "center" }}>{row.ic}</span>
              <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.faint, letterSpacing: 0.5 }}>{row.l.toUpperCase()}</span>
                <div style={{ color: T.txt }}>{row.v}</div>
              </div>
            </div>
          ))}
          <div style={{
            background: `${r.c}10`, border: `1px solid ${r.c}33`, borderRadius: 7,
            padding: "6px 10px", marginTop: 7,
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: T.faint }}>FORMULE UTILE</span>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: T.txt, marginTop: 1 }}>{r.fo}</div>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
        <button onClick={() => go({ view: "dselec" })} style={primBtn(T.green)}>◈ Voir les DS corrigés</button>
        <button onClick={() => go({ view: "formules", subject: "elec" })} style={ghostBtn()}>∑ Formules d'électronique</button>
      </div>
    </div>
  );
}

const RECO_INFO = [
  { type: "Pointeurs & syntaxe C", c: T.cyan,
    rec: "On travaille sur des pointeurs (*, &), l'accès à un champ via -> ou la déréférence (*p).champ.",
    met: "Identifier si le pointeur pointe vers une donnée ou une structure. Utiliser -> pour les structures, * pour les scalaires. Bien passer l'adresse avec & dans scanf.",
    pie: "Oublier le & dans scanf, confondre * (déréférence) et & (adresse), ou utiliser -> sur une variable non pointeur.",
    fo: "p->champ  ≡  (*p).champ" },
  { type: "Allocation dynamique (malloc / free)", c: T.amber,
    rec: "On crée ou libère de la mémoire au runtime : tableau de taille inconnue, champ dynamique dans une structure.",
    met: "1. Décider la taille (n × sizeof(type)). 2. Appeler malloc, vérifier si NULL. 3. Utiliser la mémoire. 4. Libérer dans l'ordre inverse : les champs dynamiques AVANT la structure.",
    pie: "Free la structure avant son champ dynamique (fuite mémoire), oublier de tester le retour de malloc, confondre la taille en octets et le nombre d'éléments.",
    fo: "malloc(n * sizeof(type))  ;  free dans l'ordre inverse de l'allocation" },
  { type: "Structures à champ dynamique", c: T.green,
    rec: "Une struct contient un char* (ou un tableau de taille variable) qui doit être alloué séparément.",
    met: "Lire un champ char* : fgets → strcspn (retirer \\n) → malloc(strlen+1) → strcpy. Libérer le char* AVANT le struct.",
    pie: "Oublier strcspn (le \\n reste dans la chaîne), malloc de strlen sans +1 (pas de place pour \\0), ou free dans le mauvais ordre.",
    fo: "s.nom = malloc(strlen(buf)+1)  ;  strcpy(s.nom, buf)" },
  { type: "Piles & files (LIFO / FIFO)", c: T.violet,
    rec: "On traite des éléments dans un ordre particulier : LIFO (pile, dernier entré = premier sorti) ou FIFO (file, premier entré = premier sorti).",
    met: "Choisir pile ou file selon l'ordre de traitement. Pour parcourir ET libérer : while(!vide) → dépiler/défiler → traiter → (stocker si besoin). Pour inverser : vider dans une pile, puis revider.",
    pie: "Réenfiler en parcourant une file → boucle infinie. Mal caster le void* renvoyé par defiler. Confondre tête (out) et queue (in) d'une file.",
    fo: "while(!fileVide(f)) { e = defiler(f); ... }  ;  empiler(p, e)" },
  { type: "Listes chaînées", c: T.coral,
    rec: "Un maillon contient une donnée et un pointeur vers le maillon suivant (next). On parcourt avec une boucle while(p != NULL).",
    met: "Parcours : p = tête, while(p) { traiter p->data ; p = p->next; }. Insertion en tête : crée maillon, next = ancienne tête, tête = maillon. Libération : parcourir et free chaque maillon.",
    pie: "Perdre la référence à la tête. Oublier de mettre next = NULL sur le dernier maillon. Free le maillon avant d'avoir sauvegardé p->next.",
    fo: "Noeud* n = malloc(sizeof(Noeud)) ; n->next = tete ; tete = n" },
  { type: "Récursivité", c: T.yellow,
    rec: "Une fonction qui s'appelle elle-même. On reconnaît un cas de base (arrêt) et un cas récursif (décomposition).",
    met: "1. Identifier le cas de base (liste vide, n=0, condition d'arrêt). 2. Écrire le cas récursif qui réduit le problème. 3. Vérifier sur un petit exemple à la main (pile d'appels).",
    pie: "Oublier le cas de base → récursion infinie. Se tromper sur la condition d'arrêt. Ne pas retourner la valeur de l'appel récursif.",
    fo: "if(cas_base) return val_base ; return f(n-1) + ..." },
];

function ReconnaitreInfoView({ go }) {
  return (
    <div>
      <BackBar onBack={() => go({ view: "subject", id: "info" })} label="Informatique" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Reconnaître l'exercice en informatique</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 14, lineHeight: 1.5 }}>
        Le réflexe clé : identifier le type d'exercice pour appliquer la bonne méthode.
        Voici les 6 cas du programme.
      </p>
      {RECO_INFO.map((r) => (
        <div key={r.type} style={{
          background: T.bg2, border: `1px solid ${r.c}44`, borderLeft: `3px solid ${r.c}`,
          borderRadius: 11, padding: "12px 14px", marginBottom: 9,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800, color: r.c, marginBottom: 7 }}>
            {r.type}
          </div>
          {[
            { l: "Comment le reconnaître", v: r.rec, ic: "◆", ic_c: r.c },
            { l: "Méthode à appliquer", v: r.met, ic: "→", ic_c: T.green },
            { l: "Piège fréquent", v: r.pie, ic: "✗", ic_c: T.coral },
          ].map((row) => (
            <div key={row.l} style={{ display: "flex", gap: 8, margin: "5px 0" }}>
              <span style={{ color: row.ic_c, fontSize: 11, marginTop: 2, width: 12, flexShrink: 0, textAlign: "center" }}>{row.ic}</span>
              <div style={{ fontSize: 12, lineHeight: 1.5 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.faint, letterSpacing: 0.5 }}>{row.l.toUpperCase()}</div>
                <div style={{ color: T.txt }}>{row.v}</div>
              </div>
            </div>
          ))}
          <div style={{
            background: `${r.c}10`, border: `1px solid ${r.c}33`, borderRadius: 7,
            padding: "6px 10px", marginTop: 7,
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: T.faint }}>FORMULE / RÈGLE UTILE</div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: T.txt, marginTop: 1 }}>{r.fo}</div>
          </div>
        </div>
      ))}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
        <button onClick={() => go({ view: "exos" })} style={primBtn(T.cyan)}>✎ Exercices info</button>
        <button onClick={() => go({ view: "subject", id: "info" })} style={ghostBtn()}>▣ Fiches info</button>
      </div>
    </div>
  );
}

function SearchView({ query, go }) {
  const [q, setQ] = useState(query || "");
  const term = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (term.length < 2) return [];
    const out = [];
    ALL_FICHES.forEach((f) => {
      if ((f.title + " " + f.blurb + " " + JSON.stringify(f.sections)).toLowerCase().includes(term))
        out.push({ kind: "Fiche", subject: f.subject, label: f.title, sub: f.sub,
          target: { view: "subject", id: f.subject } });
    });
    (typeof FORMULAS !== "undefined" ? FORMULAS : []).forEach((fo) => {
      if ((fo.nom + " " + fo.chapter + " " + fo.quand + " " + (fo.variables || []).join(" ")).toLowerCase().includes(term))
        out.push({ kind: "Formule", subject: fo.subject, label: fo.nom, sub: fo.chapter,
          target: { view: "formules", subject: fo.subject } });
    });
    EXOS.forEach((e) => {
      if ((e.title + " " + e.tags.join(" ") + " " + JSON.stringify(e.enonce)).toLowerCase().includes(term))
        out.push({ kind: "Exercice", subject: e.subject, label: e.title, sub: e.tags.slice(0, 3).join(" · "),
          target: { view: "exos" } });
    });
    QUIZZES.forEach((qz) => {
      if (qz.title.toLowerCase().includes(term))
        out.push({ kind: "Quiz", subject: qz.subject, label: qz.title,
          target: { view: "quiz" } });
    });
    DOCS.forEach((d) => {
      if ((d.name + " " + d.resume + " " + (d.detail || "")).toLowerCase().includes(term))
        out.push({ kind: "Document", subject: d.subject, label: d.name, sub: d.resume,
          target: { view: "documents" } });
    });
    (typeof VIDEOS !== "undefined" ? VIDEOS : []).forEach((v) => {
      if ((v.titre + " " + v.chapter + " " + v.desc).toLowerCase().includes(term))
        out.push({ kind: "Vidéo", subject: v.subject, label: v.titre, sub: v.chapter,
          target: { view: "videos", subject: v.subject } });
    });
    FLASHCARDS.forEach((c) => {
      if ((c.front + " " + c.back + " " + c.chapter).toLowerCase().includes(term))
        out.push({ kind: "Flashcard", subject: c.subject, label: c.front, sub: c.chapter,
          target: { view: "flashcards" } });
    });
    SUJETS.forEach((t) => {
      if ((t.title + " " + t.tags.join(" ")).toLowerCase().includes(term))
        out.push({ kind: "Annale", subject: t.subject, label: t.title,
          target: { view: "training", subject: t.subject } });
    });
    METHODES.forEach((bloc) => bloc.items.forEach((it) => {
      if ((it.titre + " " + it.reconnaitre).toLowerCase().includes(term))
        out.push({ kind: "Méthode", subject: bloc.subject, label: it.titre,
          target: { view: "methodes" } });
    }));
    ERREURS.forEach((bloc) => bloc.items.forEach((it) => {
      if ((it.titre + " " + it.exp).toLowerCase().includes(term))
        out.push({ kind: "Erreur", subject: bloc.subject, label: it.titre,
          target: { view: "erreurs" } });
    }));
    DEBUTANT.forEach((d) => {
      if ((d.titre + " " + d.simple).toLowerCase().includes(term))
        out.push({ kind: "Notion", subject: d.subject, label: d.titre,
          target: { view: "debutant" } });
    });
    return out;
  }, [term]);

  const ORDER = ["Fiche", "Formule", "Exercice", "Quiz", "Document", "Vidéo", "Flashcard", "Annale", "Méthode", "Erreur", "Notion"];
  const KIND_COLOR = {
    Fiche: T.cyan, Formule: T.yellow, Exercice: T.amber, Quiz: T.green, Document: T.violet,
    Vidéo: T.coral, Flashcard: T.violet, Annale: T.green, Méthode: T.cyan, Erreur: T.coral, Notion: T.blue,
  };
  const groups = ORDER
    .map((k) => ({ kind: k, items: results.filter((r) => r.kind === k) }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      <BackBar onBack={() => go({ view: "home" })} label="Accueil" />
      <h2 style={{ ...titleSt(20), marginBottom: 3 }}>Recherche</h2>
      <p style={{ fontSize: 12.5, color: T.dim, marginBottom: 12 }}>
        Cherche dans les fiches, formules, exercices, quiz, documents et vidéos.
      </p>

      <input
        autoFocus
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="malloc, intégrale, oscillateur, AOP, Bode…"
        style={{
          width: "100%", background: T.bg2, border: `1px solid ${T.line}`,
          borderRadius: 10, padding: "12px 14px", color: T.txt, fontSize: 13,
          fontFamily: "'Spectral', serif", outline: "none", marginBottom: 14,
        }}
      />

      {term.length >= 2 && (
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: T.faint, marginBottom: 10 }}>
          {results.length} résultat{results.length !== 1 ? "s" : ""} · {groups.length} catégorie{groups.length !== 1 ? "s" : ""}
        </div>
      )}
      {term.length >= 2 && results.length === 0 && (
        <div style={{ color: T.dim, fontSize: 13, padding: 14 }}>
          Aucun résultat pour « {q} ». Essaie un autre mot-clé (ex : pile, intégrale, ressort, filtre).
        </div>
      )}
      {term.length < 2 && (
        <div style={{ color: T.faint, fontSize: 12.5, padding: "10px 2px" }}>
          Tape au moins 2 lettres pour lancer la recherche.
        </div>
      )}

      {groups.map((g) => (
        <div key={g.kind} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
            <TypeBadge label={g.kind} color={KIND_COLOR[g.kind]} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: T.faint }}>
              {g.items.length}
            </span>
            <div style={{ flex: 1, height: 1, background: T.line }} />
          </div>
          {g.items.map((r, i) => (
            <div key={i} className="ece-card" style={{
              background: T.bg2, border: `1px solid ${T.line}`,
              borderLeft: `3px solid ${subjectById(r.subject).color}`, borderRadius: 10,
              padding: "10px 13px", marginBottom: 7, display: "flex", alignItems: "center", gap: 10,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 3, flexWrap: "wrap" }}>
                  <TypeBadge label={r.kind} color={KIND_COLOR[r.kind]} />
                  <SubjectBadge subject={r.subject} small />
                </div>
                <div style={{ fontSize: 13, color: T.txt, fontWeight: 600, lineHeight: 1.35 }}>{r.label}</div>
                {r.sub && (
                  <div style={{ fontSize: 11, color: T.dim, marginTop: 1,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.sub}</div>
                )}
              </div>
              <button onClick={() => go(r.target)} style={{ ...primBtn(subjectById(r.subject).color), padding: "8px 13px", flexShrink: 0 }}>
                Ouvrir
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ================== APP ================== */

/* Stockage de la progression : localStorage (navigateur normal / Vite),
   avec repli en mémoire si localStorage est indisponible (aperçu sandboxé). */
const eceMemStore = {};
const eceStorage = {
  get(key) {
    try { return window.localStorage.getItem(key); }
    catch (e) { return key in eceMemStore ? eceMemStore[key] : null; }
  },
  set(key, val) {
    try { window.localStorage.setItem(key, val); }
    catch (e) { eceMemStore[key] = val; }
  },
};

const DEFAULT_PROGRESS = { fiches: [], ficheStatus: {}, quiz: {}, exos: [], cards: {}, partiels: [] };

const NAV_GROUPS = [
  { id: "reviser", label: "Réviser", icon: "▣", items: [
    { view: "subject", id: "info", label: "Fiches · Informatique", icon: "{ }" },
    { view: "subject", id: "math", label: "Fiches · Mathématiques", icon: "∫" },
    { view: "subject", id: "meca", label: "Fiches · Mécanique", icon: "↻" },
    { view: "subject", id: "elec", label: "Fiches · Électronique", icon: "⏚" },
    { view: "formules", label: "Formules", icon: "∑" },
    { view: "methodes", label: "Méthodes types", icon: "◎" },
    { view: "reconnaitreinfo", label: "Reconnaître un exo (info)", icon: "▶" },
    { view: "erreurs", label: "Erreurs fréquentes", icon: "✗" },
    { view: "videos", label: "Vidéos", icon: "▶" },
    { view: "documents", label: "Documents", icon: "▤" },
  ] },
  { id: "entrainer", label: "S'entraîner", icon: "✎", items: [
    { view: "exos", label: "Exercices", icon: "✎" },
    { view: "quiz", label: "Quiz", icon: "✓" },
    { view: "formulesquiz", label: "Quiz formules", icon: "⊕" },
    { view: "flashcards", label: "Flashcards", icon: "⮂" },
    { view: "training", label: "Annales", icon: "◈" },
    { view: "dselec", label: "DS Électronique corrigés", icon: "⏚" },
    { view: "partielblanc", label: "Partiel blanc", icon: "⏱" },
  ] },
  { id: "outils", label: "Outils", icon: "⚙", items: [
    { view: "dashboard", label: "Dashboard", icon: "◷" },
    { view: "generateur", label: "Générateur de sujet", icon: "⚙" },
    { view: "express", label: "Parcours de révision", icon: "⚡" },
    { view: "partielsoon", label: "J'ai partiel bientôt", icon: "⏰" },
    { view: "search", label: "Recherche", icon: "⌕" },
  ] },
];
const VIEW_GROUP = {};
NAV_GROUPS.forEach((g) => g.items.forEach((it) => { VIEW_GROUP[it.view] = g.id; }));

function pickReco(progress) {
  const opts = [
    { ratio: (progress.fiches || []).length / ALL_FICHES.length, view: "express", label: "Reprendre les cours", icon: "▣" },
    { ratio: (progress.exos || []).length / EXOS.length, view: "exos", label: "Faire des exercices", icon: "✎" },
    { ratio: Object.keys(progress.quiz || {}).length / QUIZZES.length, view: "quiz", label: "Lancer un quiz", icon: "✓" },
    { ratio: Object.values(progress.cards || {}).filter((v) => v === "ok").length / FLASHCARDS.length, view: "flashcards", label: "Réviser les flashcards", icon: "⮂" },
  ];
  return opts.sort((a, b) => a.ratio - b.ratio)[0];
}

function SidebarNav({ route, go, progress }) {
  const reco = pickReco(progress);
  const quick = [
    { view: "dashboard", label: "Dashboard", icon: "◷" },
    { view: "formules", label: "Formules", icon: "∑" },
    { view: "formulesquiz", label: "Quiz formules", icon: "⊕" },
    { view: "subject", id: "elec", label: "Électronique", icon: "⏚" },
    { view: "training", label: "Annales", icon: "◈" },
  ];
  const Item = ({ it }) => {
    const on = route.view === it.view && (it.id ? route.id === it.id : true);
    return (
      <button onClick={() => go({ view: it.view, id: it.id })}
        className={on ? "" : "ece-sidenav-item"}
        style={{
          display: "flex", alignItems: "center", gap: 9, width: "100%", textAlign: "left",
          background: on ? `${T.amber}1e` : "transparent",
          border: `1px solid ${on ? T.amber : "transparent"}`,
          borderLeft: on ? `3px solid ${T.amber}` : "3px solid transparent",
          borderRadius: 8, padding: "8px 10px", cursor: "pointer",
          color: on ? T.txt : T.dim, fontSize: 12, fontWeight: 700, marginBottom: 2,
        }}>
        <span style={{ width: 18, textAlign: "center", color: on ? T.amber : T.faint, fontSize: 12 }}>{it.icon}</span>
        {it.label}
      </button>
    );
  };
  const Lbl = ({ children }) => (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: 1.4,
      color: T.faint, fontWeight: 700, margin: "14px 0 5px 8px",
    }}>{children}</div>
  );
  return (
    <div style={{ padding: "15px 11px 30px" }}>
      <div onClick={() => go({ view: "home" })}
        style={{ display: "flex", gap: 9, alignItems: "center", cursor: "pointer", marginBottom: 13, padding: "0 4px" }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: `linear-gradient(135deg, ${T.amber}, ${T.coral})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          color: T.bg, fontWeight: 800, fontSize: 14.5, fontFamily: "'JetBrains Mono', monospace",
          boxShadow: `0 3px 11px -3px ${T.amber}99`,
        }}>E</div>
        <div style={{ lineHeight: 1.15 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 14.5, color: T.txt }}>
            ECE Flemme
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, letterSpacing: 1, color: T.faint }}>
            RÉVISION ING1
          </div>
        </div>
      </div>
      <button onClick={() => go({ view: reco.view })}
        style={{
          ...primBtn(T.amber), width: "100%", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 7, marginBottom: 6,
        }}>
        <span style={{ fontSize: 11 }}>▸</span> Continuer ma révision
      </button>
      <Item it={{ view: "home", label: "Accueil", icon: "⌂" }} />
      <Lbl>ACCÈS RAPIDE</Lbl>
      {quick.map((it) => <Item key={it.label} it={it} />)}
      {NAV_GROUPS.map((g) => (
        <div key={g.id}>
          <Lbl>{g.label.toUpperCase()}</Lbl>
          {g.items.map((it) => <Item key={it.label} it={it} />)}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [route, setRoute] = useState({ view: "home" });
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);
  const [navMenu, setNavMenu] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    try {
      const raw = eceStorage.get("ece-flemme-progress");
      if (raw) setProgress({ ...DEFAULT_PROGRESS, ...JSON.parse(raw) });
    } catch (e) { /* premiere visite */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ block: "start" });
  }, [route.view, route.id]);

  function save(next) {
    setProgress(next);
    try { eceStorage.set("ece-flemme-progress", JSON.stringify(next)); }
    catch (e) { /* stockage indisponible */ }
  }
  const handlers = {
    markFiche: (id) => {
      if ((progress.fiches || []).includes(id)) return;
      save({ ...progress, fiches: [...(progress.fiches || []), id] });
    },
    setStatus: (id, st) => {
      const fs = { ...(progress.ficheStatus || {}) };
      if (st) fs[id] = st; else delete fs[id];
      save({ ...progress, ficheStatus: fs });
    },
    saveQuiz: (id, pct) => {
      const prev = (progress.quiz || {})[id];
      const best = !prev || pct >= prev.pct ? { pct } : prev;
      save({ ...progress, quiz: { ...(progress.quiz || {}), [id]: best } });
    },
    markExo: (id) => {
      const list = progress.exos || [];
      const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
      save({ ...progress, exos: next });
    },
    setCard: (id, v) => {
      const c = { ...(progress.cards || {}) };
      if (v) c[id] = v; else delete c[id];
      save({ ...progress, cards: c });
    },
    markPartiel: (id) => {
      const list = progress.partiels || [];
      if (list.includes(id)) return;
      save({ ...progress, partiels: [...list, id] });
    },
  };

  const go = (r) => { setNavMenu(null); setRoute(typeof r === "string" ? { view: r } : r); };
  handlers.go = go;

  return (
    <div style={{
      background: T.bg, minHeight: "100vh", color: T.txt,
      fontFamily: "'Spectral', Georgia, serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&family=Spectral:wght@400;500;600&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 9px; height: 9px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.bg4}; border-radius: 5px; }
        ::-webkit-scrollbar-thumb:hover { background: ${T.line}; }
        button { font-family: 'JetBrains Mono', monospace; transition: filter .14s ease, transform .1s ease; }
        button:hover { filter: brightness(1.1); }
        button:active { transform: scale(0.98); }
        input::placeholder { color: ${T.faint}; }
        .ece-pill { transition: background .15s ease, color .15s ease, border-color .15s ease; }
        .ece-pill:hover { background: ${T.bg4} !important; color: ${T.txt} !important; }
        .ece-card { transition: transform .16s ease, border-color .16s ease, box-shadow .16s ease, background .16s ease; }
        .ece-card:hover { transform: translateY(-3px); box-shadow: 0 8px 22px -10px rgba(0,0,0,0.7); }
        .ece-row { transition: background .13s ease; }
        .ece-row:hover { background: ${T.bg3} !important; }
        .ece-navwrap::-webkit-scrollbar { height: 0; }
        .ece-sidebar { display: none; }
        .ece-sidenav-item:hover { background: ${T.bg3} !important; color: ${T.txt} !important; }
        @media (min-width: 920px) {
          .ece-sidebar { display: block; }
          .ece-topbar { display: none; }
        }
      `}</style>

      <div style={{ display: "flex", minHeight: "100vh", maxWidth: 1180, margin: "0 auto" }}>
        <aside className="ece-sidebar" style={{
          width: 224, flexShrink: 0, borderRight: `1px solid ${T.line}`,
          position: "sticky", top: 0, alignSelf: "flex-start", height: "100vh",
          overflowY: "auto", background: T.bg,
        }}>
          <SidebarNav route={route} go={go} progress={progress} />
        </aside>
        <div style={{ flex: 1, minWidth: 0 }}>

      <header className="ece-topbar" style={{
        position: "sticky", top: 0, zIndex: 30, background: `${T.bg}f2`,
        backdropFilter: "blur(12px)", borderBottom: `1px solid ${T.line}`,
      }}>
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 14px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0" }}>
            <div onClick={() => go({ view: "home" })}
              style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", flex: 1, minWidth: 0 }}>
              <div style={{
                width: 31, height: 31, borderRadius: 9,
                background: `linear-gradient(135deg, ${T.amber}, ${T.coral})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: T.bg, fontWeight: 800, fontSize: 15, fontFamily: "'JetBrains Mono', monospace",
                boxShadow: `0 3px 11px -3px ${T.amber}99`, flexShrink: 0,
              }}>E</div>
              <div style={{ lineHeight: 1.15 }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 800, fontSize: 15.5, color: T.txt }}>
                  ECE Flemme
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, letterSpacing: 1.3, color: T.faint }}>
                  RÉVISION ING1 · ECE PARIS
                </div>
              </div>
            </div>
            <button onClick={() => go({ view: "search" })} className="ece-pill" title="Recherche"
              style={{
                width: 36, height: 36, borderRadius: 9, background: T.bg2,
                border: `1px solid ${T.line}`, color: T.dim, cursor: "pointer",
                fontSize: 15, flexShrink: 0,
              }}>⌕</button>
          </div>
          <div style={{ display: "flex", gap: 6, paddingBottom: 9, flexWrap: "wrap" }}>
            <button onClick={() => go({ view: "home" })}
              className={route.view === "home" ? "" : "ece-pill"}
              style={{
                display: "flex", alignItems: "center", gap: 6, flex: "0 0 auto",
                background: route.view === "home" ? T.amber : T.bg2,
                border: `1px solid ${route.view === "home" ? T.amber : T.line}`,
                color: route.view === "home" ? T.bg : T.dim, padding: "8px 14px", borderRadius: 999,
                cursor: "pointer", fontSize: 12, fontWeight: 700,
                boxShadow: route.view === "home" ? `0 3px 12px -4px ${T.amber}aa` : "none",
              }}>
              <span style={{ fontSize: 12.5 }}>⌂</span>Accueil
            </button>
            {NAV_GROUPS.map((g) => {
              const groupActive = VIEW_GROUP[route.view] === g.id;
              const open = navMenu === g.id;
              return (
                <button key={g.id} onClick={() => setNavMenu(open ? null : g.id)}
                  className={open || groupActive ? "" : "ece-pill"}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, flex: "0 0 auto",
                    background: open ? T.bg4 : groupActive ? `${T.amber}22` : T.bg2,
                    border: `1px solid ${open || groupActive ? T.amber : T.line}`,
                    color: open || groupActive ? T.txt : T.dim, padding: "8px 14px", borderRadius: 999,
                    cursor: "pointer", fontSize: 12, fontWeight: 700,
                  }}>
                  <span style={{ fontSize: 12.5, color: groupActive || open ? T.amber : T.faint }}>{g.icon}</span>
                  {g.label}
                  <span style={{ fontSize: 9, transform: open ? "rotate(180deg)" : "none", transition: "transform .15s" }}>▾</span>
                </button>
              );
            })}
          </div>
        </div>

        {navMenu && (
          <>
            <div onClick={() => setNavMenu(null)}
              style={{ position: "fixed", inset: 0, background: "transparent", zIndex: 1 }} />
            <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, zIndex: 2,
              background: T.bg2, borderBottom: `1px solid ${T.line}`,
              boxShadow: "0 14px 30px -12px rgba(0,0,0,0.8)",
            }}>
              <div style={{ maxWidth: 780, margin: "0 auto", padding: "13px 14px 15px" }}>
                {NAV_GROUPS.filter((g) => g.id === navMenu).map((g) => (
                  <div key={g.id}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: 1.6,
                      color: T.amber, fontWeight: 700, marginBottom: 9,
                    }}>{g.label.toUpperCase()}</div>
                    <div style={{
                      display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(158px, 1fr))", gap: 7,
                    }}>
                      {g.items.map((it) => {
                        const on = route.view === it.view && (it.id ? route.id === it.id : true);
                        return (
                          <button key={it.label} onClick={() => go({ view: it.view, id: it.id })}
                            className={on ? "" : "ece-pill"}
                            style={{
                              display: "flex", alignItems: "center", gap: 9, textAlign: "left",
                              background: on ? `${T.amber}1e` : T.bg3,
                              border: `1px solid ${on ? T.amber : T.line}`, borderRadius: 9,
                              padding: "9px 11px", cursor: "pointer",
                              color: on ? T.txt : T.dim, fontSize: 12, fontWeight: 700,
                            }}>
                            <span style={{
                              width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                              background: on ? `${T.amber}33` : T.bg4, color: on ? T.amber : T.faint,
                              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
                            }}>{it.icon}</span>
                            {it.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </header>

      <main ref={scrollRef} style={{ maxWidth: 780, margin: "0 auto", padding: "18px 14px 64px" }}>
        {!loaded ? (
          <div style={{ color: T.faint, fontSize: 13, padding: 40, textAlign: "center" }}>Chargement…</div>
        ) : (
          <>
            {route.view === "home" && <Home go={go} progress={progress} />}
            {route.view === "dashboard" && <DashboardView progress={progress} go={go} />}
            {route.view === "subject" && <SubjectView subjectId={route.id} progress={progress} handlers={handlers} go={go} />}
            {route.view === "flashcards" && <FlashcardsView progress={progress} handlers={handlers} go={go} />}
            {route.view === "quiz" && <QuizGlobalView progress={progress} handlers={handlers} go={go} />}
            {route.view === "exos" && <ExosGlobalView progress={progress} handlers={handlers} go={go} />}
            {route.view === "training" && <TrainingView progress={progress} handlers={handlers} go={go} initialSubject={route.subject} initialOpen={route.open} />}
            {route.view === "partielblanc" && <PartielBlancView go={go} handlers={handlers} />}
            {route.view === "express" && <ParcoursView go={go} />}
            {route.view === "debutant" && <DebutantView go={go} />}
            {route.view === "erreurs" && <ErreursView go={go} />}
            {route.view === "methodes" && <MethodesView go={go} />}
            {route.view === "generateur" && <GenerateurView progress={progress} handlers={handlers} go={go} />}
            {route.view === "tombe" && <TombeView go={go} />}
            {route.view === "methodespartiel" && <MethodesPartielView go={go} />}
            {route.view === "documents" && <DocumentsView go={go} />}
            {route.view === "videos" && <VideosView go={go} initialSubject={route.subject} />}
            {route.view === "methodeelec" && <MethodeElecView go={go} />}
            {route.view === "entrainementelec" && <EntrainementElecView go={go} />}
            {route.view === "formules" && <FormulesView go={go} initialSubject={route.subject} />}
            {route.view === "formulesquiz" && <FormulesQuizView go={go} />}
            {route.view === "partielsoon" && <PartielSoonView go={go} />}
            {route.view === "dselec" && <DSElecView go={go} />}
            {route.view === "schemaselec" && <SchemasElecView go={go} />}
            {route.view === "reconnaitreelec" && <ReconnaitreElecView go={go} />}
            {route.view === "reconnaitreinfo" && <ReconnaitreInfoView go={go} />}
            {route.view === "reviserannale" && <ReviserAnnaleView progress={progress} handlers={handlers} go={go} />}
            {route.view === "search" && <SearchView query={route.q} go={go} />}
          </>
        )}
      </main>

      <footer style={{
        borderTop: `1px solid ${T.line}`, padding: "15px 14px", textAlign: "center",
        color: T.faint, fontSize: 10.5, fontFamily: "'JetBrains Mono', monospace",
      }}>
        ECE Flemme · révision ING1 · ECE Paris — progression sauvegardée sur cet appareil
      </footer>
        </div>
      </div>
    </div>
  );
}