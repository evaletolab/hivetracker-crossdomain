# app.hivertracker.io cross domain communication
L’objectif est de réaliser une solution logicielle qui permet d’utiliser les fonctionnalités business de app.hivetracker.io et le bluetooth (Ionic) dans le même context applicatif ou au moins dans le même OS avec deux applications distinctes. 

Nous allons créer une API (js) selon les normes de sécurité (CROSS-DOMAIN) qui peut fonctionner dans le même processus mémoire entre le navigateur pour app.hivetracker.io et Ionic. Cette API est composée de deux parties

1. Communication depuis hivetracker.io à Ionic (BLE)
2. Communication depuis Ionic (BLE) à Hivetracker.io 


## CROSS-DOMAIN Communication
Pour permettre une communication CROSS-DOMAIN en toute sécurité il faut suivre quelques règles. Normalement, les scripts de différentes pages sont autorisés à accéder les uns aux autres si et seulement si les pages depuis lesquelles ils sont exécutés ont des URL de même origine, c'est-à-dire avec le même protocole (généralement http ou https), le même numéro de port (80 étant le port par défaut pour  http), et le même nom d'hôte (à condition que document.domain soit initialisé à la même valeur par les deux pages).
 La nature de l'application Web hivetracker.io et son fonctionnement avec PHP ne permet pas de garantir la même origine, ainsi il n’est pas possible de faire une passerelle "naïve" entre le Web et Ionic.


* https://developer.mozilla.org/fr/docs/Web/Security/Same_origin_policy_for_JavaScript
* https://developer.mozilla.org/fr/docs/Web/API/Window/postMessage

## Protocol v1

### 1. De Hivetracker.io à Ionic
``` js
  const job = {
    action: 'hivertracker:job',
    addresses: (*addresses*),
    run: *cmd*
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


### 2. De Ionic à Hivetracker.io
Cette fonction permet de déterminer le résultat d'un **job** associé à des périphériques BluetoothLE.


``` js
  window.addEventListener('message', (jobResults) => {
    try{
      //
      // Try to decode buffer
      const results = JSON.parse(jobResults);

      //
      // voerify the context
      if (jobResults.action === 'hivetracker:receive') {
        return;
      }

      //
      // Access on result 
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

#### JobResults
`JobResults` est un  tableau de `BEEconJobResult[]`. Un `BEEconJobResult` décrit le résultat positif ou négatif d'une commande. Un résultat est toujours relatif au dernier `BEEconJob`.


``` js
export interface BEEconJobResult {
  address: string;
  result: string;
  error: string;
}
``` 





## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


