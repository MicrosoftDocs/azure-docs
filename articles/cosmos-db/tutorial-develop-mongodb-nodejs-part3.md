---
title: "Azure Cosmos DB: Create a MEAN.js app - Part 3 | Microsoft Docs"
description: Learn how to create a MEAN.js app for Azure Cosmos DB using the exact same APIs you use for MongoDB. 
services: cosmos-db
documentationcenter: ''
author: mimig1
manager: jhubbard
editor: ''

ms.assetid: 
ms.service: cosmos-db
ms.workload: 
ms.tgt_pltfrm: na
ms.devlang: nodejs
ms.topic: hero-article
ms.date: 08/11/2017
ms.author: mimig
ms.custom: mvc

---
# Create a MEAN.js app with Azure Cosmos DB - Part 3: Build the Angular UI

Azure Cosmos DB is Microsoft’s globally distributed multi-model database service. You can quickly create and query document, key/value, and graph databases, all of which benefit from the global distribution and horizontal scale capabilities at the core of Azure Cosmos DB. 

This multi-part tutorial demonstrates how to create a new [MongoDB](mongodb-introduction.md) API app written in Node.js with Express and Angular and connect it to your Azure Cosmos DB database. Azure Cosmos DB supports MongoDB client connections, so you can use Azure Cosmos DB in place of Mongo, but use the exact same code that you use when you talk to Mongo. By using Azure Cosmos DB instead of MongoDB, you benefit from the deployment, scaling, security, and super-fast reads and writes that Azure Cosmos DB provides as a managed service. 

Part 3 of the tutorial covers the following tasks:

> [!div class="checklist"]
> * Fill out the A in MEAN and build the Angular UI that hits the Express API

## Video walkthrough

> [!VIDEO https://www.youtube.com/embed/MnxHuqcJVoM]

## Prerequisites

Before starting this part of the tutorial, ensure you've completed the steps in [Part 2](tutorial-develop-mongodb-nodejs-part2.md) of the tutorial.

## 

1. In Visual Studio Code, click the Stop button ![Stop button in Visual Studio Code](./media/tutorial-develop-mongodb-nodejs-part3/stop-button.png) to stop the Node app.

2. In a Windows Command Prompt or Mac Terminal window, enter the following code to generate a heroes component.

    ```bash
    ng g c heroes --flat
    ```

    The terminal window displays confirmation of the new components.

    ```bash
    installing component
      create src\client\app\heroes.component.ts
      update src\client\app\app.module.ts 
    ```

    Let's take a look at the files that were created and updated. 

3. In Visual Studio Code, navigate to the new src\client\app folder and open the new heroes.component.ts file created by step 2. 

    > ![TIP]
    > If the app folder doesn't display in Visual Studio Code, enter CMD + SHIFT P on a Mac or Ctrl + Shift + P on Windows to open the Command Palette, and then enter `Reload Window` to pick up the system change.

    ![Open the heroes.component.ts file](./media/tutorial-develop-mongodb-nodejs-part3/open-folder.png)

4. Now open the app.module.ts file, and notice that it added the HeroesComponent to the declarations on line 5 and it imported it as well on line 10.

    ![Open the app-module.ts file](./media/tutorial-develop-mongodb-nodejs-part3/app-module-file.png)


Now that you have your Heroes component, create a new file for the heroes component HTML. Because we created a minimal app, it was going to put the HTML in the same file as the typescript file, but we want to break it out and create a separate file.

1. In the Explorer pane, right click the app folder, click New File, and name the new file heroes.components.html.

2. In the heroes.components.ts file, delete lines 5 through 9 

    ```
    template: `
        <p>
          heroes Works!
        </p>
      `,
      ```
      and replace it with
  
    ```
    templateUrl: './heroes.component.html',
    ```
 
    > [!TIP]
    > You can use John Papa's Angular Essentials extenstions and snippets for Visual Studio Code to speed up your development. Click the Extensions button ![Visual Studio Code Extensions button](./media/tutorial-develop-mongodb-nodejs-part3/extensions-button.png) and type angular essentials in the search box, or go to [http://jpapa.me/angularessentials](http://jpapa.me/angularessentials). After installing click the Reload button to use the new extensions.
    >
    > ![Angular Essentials extension](./media/tutorial-develop-mongodb-nodejs-part3/angular-essentials-extension.png)

3. Go back to the heroes.components.html file and copy in this code. The div is the container for the entire page, and then inside we've got a list of items, and we're going to need to have heroes models which we need to create so that when you click on one you can select it and edit it or delete it. Then we've got some styling so you know which one has been selected. And then there's an edit area so that you can add a new hero or edit an existing one. 

    ```html
    <div>
      <ul class="heroes">
        <li *ngFor="let hero of heroes" (click)="onSelect(hero)" [class.selected]="hero === selectedHero">
          <button class="delete-button" (click)="deleteHero(hero)">Delete</button>
          <div class="hero-element">
            <div class="badge">{{hero.id}}</div>
            <div class="name">{{hero.name}}</div>
            <div class="saying">{{hero.saying}}</div>
          </div>
        </li>
      </ul>
      <div class="editarea">
        <button (click)="enableAddMode()">Add New Hero</button>
        <div *ngIf="selectedHero">
          <div class="editfields">
            <div>
              <label>id: </label>
              <input [(ngModel)]="selectedHero.id" placeholder="id" *ngIf="addingHero" />
              <label *ngIf="!addingHero" class="value">{{selectedHero.id}}</label>
            </div>
            <div>
              <label>name: </label>
              <input [(ngModel)]="selectedHero.name" placeholder="name" />
            </div>
            <div>
              <label>saying: </label>
              <input [(ngModel)]="selectedHero.saying" placeholder="saying" />
            </div>
          </div>
          <button (click)="cancel()">Cancel</button>
          <button (click)="save()">Save</button>
        </div>
      </div>
    </div>
    ```

4. Now that we've got the HTML in place we need to add to the heroes.component.ts file so we can interact with the template. First, add some models, add hero flags for a list of heroes. Then fill in the constructor and go and get some heroes, and initialize the hero service component that will go get all the data.

    ```
    import { Component, OnInit } from '@angular/core';

    import { Hero } from './hero';
    import { HeroService } from './hero.service';

    @Component({
      selector: 'app-heroes',
      templateUrl: './heroes.component.html'
    })
    export class HeroesComponent implements OnInit {
      addingHero = false;
      heroes: any = [];
      selectedHero: Hero;
    
      constructor(private heroService: HeroService) {}
    
      ngOnInit() {
       this.getHeroes();
      }

      cancel() {
        this.addingHero = false;
        this.selectedHero = null;
      }

      deleteHero(hero: Hero) {
        this.heroService.deleteHero(hero).subscribe(res => {
          this.heroes = this.heroes.filter(h => h !== hero);
          if (this.selectedHero === hero) {
            this.selectedHero = null;
          }
        });
      }

      getHeroes() {
        return this.heroService.getHeroes().subscribe(heroes => {
          this.heroes = heroes;
        });
      }

      enableAddMode() {
        this.addingHero = true;
        this.selectedHero = new Hero();
      }

      onSelect(hero: Hero) {
        this.addingHero = false;
        this.selectedHero = hero;
      }

      save() {
        if (this.addingHero) {
          this.heroService.addHero(this.selectedHero).subscribe(hero => {
            this.addingHero = false;
            this.selectedHero = null;
            this.heroes.push(hero);
          });
        } else {
          this.heroService.updateHero(this.selectedHero).subscribe(hero => {
            this.addingHero = false;
            this.selectedHero = null;
          });
        }
      }
    }
    ```

5. In Explorer, open the app/app.module.ts file and add an import for a Forms module on line 14.

    ```
    imports: [
      BrowserModule,
      FormsModule
    ],
    ```

6. Then add an import for that forms module on line 3. 

    ```
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';
    import { FormsModule } from '@angular/forms';
    ```

## Use CSS to set the look and feel

1. In Visual Studio Code, open the src/client/styles.scss file.

2. Copy the following code into the styles.scss file.

    ```css
    /* You can add global styles to this file, and also import other style files */

    * {
      font-family: Arial;
    }
    h2 {
      color: #444;
      font-weight: lighter;
    }
    body {
      margin: 2em;
    }
    
    body,
    input[text],
    button {
      color: #888;
      // font-family: Cambria, Georgia;
    }
    button {
      font-size: 14px;
      font-family: Arial;
      background-color: #eee;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
      cursor: hand;
      &:hover {
        background-color: #cfd8dc;
      }
      &.delete-button {
        float: right;
        background-color: gray !important;
        background-color: rgb(216, 59, 1) !important;
        color: white;
        padding: 4px;
        position: relative;
        font-size: 12px;
      }
    }
    div {
      margin: .1em;
    }

    .selected {
      background-color: #cfd8dc !important;
      background-color: rgb(0, 120, 215) !important;
      color: white;
    }

    .heroes {
      float: left;
      margin: 0 0 2em 0;
      list-style-type: none;
      padding: 0;
      li {
        cursor: pointer;
        position: relative;
        left: 0;
        background-color: #eee;
        margin: .5em;
        padding: .5em;
        height: 3.0em;
        border-radius: 4px;
        width: 17em;
        &:hover {
          color: #607d8b;
          color: rgb(0, 120, 215);
          background-color: #ddd;
          left: .1em;
        }
        &.selected:hover {
          /*background-color: #BBD8DC !important;*/
          color: white;
        }
      }
      .text {
        position: relative;
        top: -3px;
      }
      .saying {
        margin: 5px 0;
      }
      .name {
        font-weight: bold;
      }
      .badge {
        /* display: inline-block; */
        float: left;
        font-size: small;
        color: white;
        padding: 0.7em 0.7em 0 0.5em;
        background-color: #607d8b;
        background-color: rgb(0, 120, 215);
        background-color:rgb(134, 183, 221);
        line-height: 1em;
        position: relative;
        left: -1px;
        top: -4px;
        height: 3.0em;
        margin-right: .8em;
        border-radius: 4px 0 0 4px;
        width: 1.2em;
      }
    }

    .header-bar {
      background-color: rgb(0, 120, 215);
      height: 4px;
      margin-top: 10px;
      margin-bottom: 10px;
    }

    label {
      display: inline-block;
      width: 4em;
      margin: .5em 0;
      color: #888;
      &.value {
        margin-left: 10px;
        font-size: 14px;
      }
    }

    input {
      height: 2em;
      font-size: 1em;
      padding-left: .4em;
      &::placeholder {
          color: lightgray;
          font-weight: normal;
          font-size: 12px;
          letter-spacing: 3px;
      }
    }

    .editarea {
      float: left;
      input {
        margin: 4px;
        height: 20px;
        color: rgb(0, 120, 215);
      }
      button {
        margin: 8px;
      }
      .editfields {
        margin-left: 12px;
      }
    }
    ``` 

## Display the component

Now that we have the component set, how do we get it to show up on the screen? For that there are the default components in app.component.ts.

1. In Visual Studio Code, open app/app.component.ts.

2. In lines 6 through 8 we're going to change the title so its going to say Heroes, and then put the name of the component we just created in heroes.components.ts `<app-heroes></app-heroes>` to refer to that new component.

    ```
    template: `
      <h1>
        Heroes
      </h1>
      <div class="header-bar"></div>
      <app-heroes></app-heroes>
    `
    })
    ```
3. There are other components in heroes.components.ts that we're referring to, like the Hero component, so we need to go create that. In the Angular CLI command prompt, type `ng g cl hero` to create a hero model and a file named hero.ts.

4. In Visual Studio Code, open src\client\app\hero.ts.

5. In hero.ts, copy in the following code to add a Hero class with an id, a name, and a saying. 

    ```
    export class Hero {
    id: number;
    name: string;
    saying: string;
    }
    ```

TODO


## Next steps

In this video, you've learned the benefits of using Azure Cosmos DB to create MEAN apps and you've learned the steps involved in creating a MEAN.js app for Azure Cosmos DB that are covered in rest of the tutorial series. 

> [!div class="nextstepaction"]
> [Create a Cosmos DB account and deply the app](tutorial-develop-mongodb-nodejs-part4.md)
