#### Version: 0.1
#### Date publication: 20 Janvier 2020


# app.hivertracker.io cross domain communication
L’objectif est de réaliser une solution logicielle qui permet d’utiliser les fonctionnalités business de [app.hivetracker.io](app.hivetracker.io) et le bluetooth (Ionic) dans le même context applicatif. 

## CROSS-DOMAIN Communication
Pour permettre une communication CROSS-DOMAIN en toute sécurité il faut suivre quelques règles. Normalement, les scripts de différentes pages sont autorisés à accéder les uns aux autres si et seulement si les pages depuis lesquelles ils sont exécutés ont des URL de même origine, c'est-à-dire avec le même protocole (généralement http ou https), le même numéro de port (80 étant le port par défaut pour  http), et le même nom d'hôte (à condition que document.domain soit initialisé à la même valeur par les deux pages).
 La nature de l'application Web [app.hivetracker.io](app.hivetracker.io) et son fonctionnement avec PHP ne permet pas de garantir la même origine, ainsi il n’est pas possible de faire une passerelle "naïve" entre le Web et Ionic.


* https://developer.mozilla.org/fr/docs/Web/Security/Same_origin_policy_for_JavaScript
* https://developer.mozilla.org/fr/docs/Web/API/Window/postMessage

## Protocol v1
Nous avons créé une API (javascript) qui respecte la norme de sécurité (CROSS-DOMAIN pour javascript) qui permet un fonctionnement dans le même processus mémoire pour le navigateur (app.hivetracker.io) et Ionic (BluetoothLE). Cette API est composée des deux parties suivantes :

1. Communication depuis hivetracker.io à Ionic (BLE)
2. Communication depuis Ionic (BLE) à Hivetracker.io 
3. Un exemple complet

### 1. Communication de Hivetracker.io à Ionic
``` js
  const addresses = [
    '00:00:00:00:03:35',
    '00:00:00:00:03:36',
  ];
  
  const run = {
    cmd: "0x06",
    text: "Get epoch time",
    payload:[]
  };
  
  const job = {
    action: 'hivertracker:job',
    addresses: (addresses),
    run: (run)
  };
  window.parent.postMessage(JSON.stringify(job), '*');
```

#### Description d'un Job
Un **job** est une tâche envoyée à Ionic pour accéder en lecture ou écriture aux BluetoothLE.

``` js
export interface BEEconJob {
  action: string;
  addresses: string[];
  run: BEEconCMD;
}
``` 
Une tâche est composée d'une **[action]**, une liste d'**[addresses]** et d'une commande **[run]**.

##### Job: [action] 
Aujourd'hui seul l'action `'hivertracker:job'` est utilisée.

##### Job: [addresses]
Les adresses respectent le format d'un tablea de string :
``` js
const addresses = [
  '00:00:00:00:03:35',
  '00:00:00:00:03:36',
];
``` 

##### Job: [cmd]
C'est la structure de donnée qui sera envoyée à la liste de BEEcons. 
* La commande **[cmd]** est un string au format HEX qui représente la commande BEEcon que l'on souhaite exécuter.
* La description **[text]** permet d'afficher le nom de la commande dans l'application Ionic
* Le **[payload]** est un tableau d'entier qui représente les données associées à la commande. (exemple `payload:[10,7,22]`)

``` js
export interface BEEconCMD {
  cmd: string;
  text: string;
  payload: number[];
}
``` 

* [beecon.ts](src/app/beecon.ts) 
* [beecon-protocol.ts](src/app/beecon-protocol.ts)

### 2. Communication de Ionic à Hivetracker.io
Cette fonction permet a l'application hivetracker.io de capturer le résultat d'un **job** .


``` js
  window.addEventListener('message', (data) => {
    try{
      //
      // Try to decode buffer
      const result = JSON.parse(data);

      //
      // voerify the context
      if (result.action !== 'hivetracker:receive') {
        return;
      }

      //
      // Access on result 
      const jobResults = result.value;
      jobResults.forEach(result => {
          console.log(result.address);
          console.log(result.result);
          console.log(result.error);
      });
    }catch(error){
      // ...
    }

  });
``` 

#### Détail de JobResults
`JobResults` est un  tableau de `BEEconJobResult[]`. Un `BEEconJobResult` décrit le résultat positif ou négatif d'une commande. Un résultat est toujours relatif au dernier `BEEconJob`.
Le résultat est une représentation en String d'un buffer de bytes qui suit le format suivant `'1:112:224:43:45'`


``` js
//
// Return a list of Job result
export interface BEEconResults {
  action: string;
  value: BEEconJobResult[];
}

export interface BEEconJobResult {
  address: string;
  result: string;
  error: string;
}
``` 

* [beecon.ts](src/app/beecon.ts) 
* [beecon-protocol.ts](src/app/beecon-protocol.ts)


### 3. Un exemple complet
Dans cet exemple nous allons modifier le référentiel de temps (Set Epoch Time). Toutes les références au protocol sont décrite dans le document `Protocol APP-apparatus - rev4`.

#### Sender (A)
``` js
  const addresses = [
    '00:00:00:00:03:35',
    '00:00:00:00:03:36',
  ];

  //
  // get Epoch time in HEX 
  //  const hexStr = (Date.now()/1000|0).toString(16);
  // get array of Numbers 
  //  hexStr.match(/.{1,2}/g).map(hex=>parseInt(hex,16))
  const run = {
    cmd: "0x04",
    text: "Set epoch time",
    payload:[ 94,38,214,190]
  };
  
  const job = {
    action: 'hivertracker:job',
    addresses: (addresses),
    run: (run)
  };
  window.parent.postMessage(JSON.stringify(job), '*');
```
#### Callback (B)





## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


