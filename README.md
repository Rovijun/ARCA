# Installation du projet

1. Git clone du repository
2. Pour chaque dossier arcafront et arcaback, tapez le script suivant : `npm install`
3. Dans le dossier back à rajouter un fichier `.env` pour les variables de l'environnement back

- ```DBNAME="nom_de_votre_bdd"```
- ```DBCOLL="nom_du_collection"```
- ```DBPORT=port_de_votre_api```
- ```DBLINK="lien_de_votre_bdd"```

**Note :** la base de donnée du projet est sur mongodb, à bien vérifier les variables demandées dans le fichier `.env`


## Commençons par la partie back

- Dans la racine du projet (arcaback), tapez la commande suivante :
```npm start```
- S'il y a pas d'erreur vous trouverez dans votre console IDE un message :
```Serveur connecté sur DBPORT```


## La partie front

- Dans la racine du projet (arcafront), tapez la commande suivante :
```npm start```
- S'il y a pas d'erreur vous trouverez directement sur l'adresse : [http://localhost:3000](http://localhost:3000)
