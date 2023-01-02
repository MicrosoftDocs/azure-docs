---
author: DavidCBerry13
ms.author: daberry
ms.topic: include
ms.date: 01/30/2022
---
You can deploy your application code from a local Git repository to Azure by configuring a [Git remote](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes) in your local repo pointing at Azure to push code to. The URL of the remote repository and Git credentials needed for configuration can be retrieved using either the Azure portal or the Azure CLI.

### [Azure portal](#tab/deploy-instructions-azportal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Deploy from VS Code 1](<./deploy-local-git-azure-portal-1.md>)] | :::image type="content" source="../../media/tutorial-nodejs-mongodb-app/deploy-local-git-azure-portal-1-240px.png" alt-text="A screenshot showing how to navigate to a web app using the search box in Azure portal." lightbox="../../media/tutorial-nodejs-mongodb-app/deploy-local-git-azure-portal-1.png"::: |
| [!INCLUDE [Deploy from VS Code 2](<./deploy-local-git-azure-portal-2.md>)] | :::image type="content" source="../../media/tutorial-nodejs-mongodb-app/deploy-local-git-azure-portal-2-240px.png" alt-text="A screenshot showing te location of the deployment page and how to configure a web app for local Git deployment in the Azure portal." lightbox="../../media/tutorial-nodejs-mongodb-app/deploy-local-git-azure-portal-2.png"::: |
| [!INCLUDE [Deploy from VS Code 3](<./deploy-local-git-azure-portal-3.md>)] | :::image type="content" source="../../media/tutorial-nodejs-mongodb-app/deploy-local-git-azure-portal-3-240px.png" alt-text="A screenshot of the Azure portal showing the Git URL to push code to for local Git deployments." lightbox="../../media/tutorial-nodejs-mongodb-app/deploy-local-git-azure-portal-3.png"::: |
| [!INCLUDE [Deploy from VS Code 3](<./deploy-local-git-azure-portal-4.md>)] | :::image type="content" source="../../media/tutorial-nodejs-mongodb-app/deploy-local-git-azure-portal-4-240px.png" alt-text="A screenshot of the Azure portal showing where to retrieve the deployment credentials for local Git deployment." lightbox="../../media/tutorial-nodejs-mongodb-app/deploy-local-git-azure-portal-4.png"::: |

### [Azure CLI](#tab/deploy-instructions-azcli)

[!INCLUDE [Deploy from VS Code 3](<./deploy-local-git-cli.md>)]

---

Next, let's add an Azure origin to our local Git repo using the App Service Git deployment URL from the step where we created our App Service.  Make sure to replace your app name in the url below.  You can also get this completed URL from the Azure Portal Local Git/FTPS Credentials tab.

```Terminal
git remote add azure https://<your-app-name>.scm.azurewebsites.net/<your-app-name>.git
```

You can now push code from your local Git repository to Azure using the Git remote you just configured.

```Terminal
## Master is the default deployment branch for App Service - this will ensure our local main branch works for the deployment
git push azure main:master
```

The first time you push code to Azure, Git will prompt you for the Azure deployment credentials you obtained in a previous step. Git will then cache these credentials so you will not have to re-enter them on subsequent deployments.
