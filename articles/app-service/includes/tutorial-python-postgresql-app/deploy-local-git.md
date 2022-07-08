---
author: jess-johnson-msft
ms.author: jejohn
ms.topic: include
ms.date: 01/25/2022
ms.service: app-service
ms.role: developer
ms.devlang: python
ms.custom: devx-track-python
---

You can deploy your application code from a local Git repository to Azure by configuring a [Git remote](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes) in your local repo pointing at Azure to push code to. The URL of the remote repository and Git credentials needed for configuration can be retrieved using either the Azure portal or the Azure CLI.

### [Azure portal](#tab/deploy-instructions-azportal)

| Instructions    | Screenshot |
|:----------------|-----------:|
| [!INCLUDE [Deploy local Git Azure portal 1](<./deploy-local-git-azure-portal-1.md>)] | :::image type="content" source="../../media/tutorial-python-postgresql-app/deploy-local-git-azure-portal-1-240px.png" alt-text="A screenshot showing how to locate your App Service using the search toolbar at the top of the Azure portal." lightbox="../../media/tutorial-python-postgresql-app/deploy-local-git-azure-portal-1.png"::: |
| [!INCLUDE [Deploy local Git Azure portal 2](<./deploy-local-git-azure-portal-2.md>)] | :::image type="content" source="../../media/tutorial-python-postgresql-app/deploy-local-git-azure-portal-2-240px.png" alt-text="A screenshot showing how to navigate to the deployment center in App Service and select Local Git as the deployment method in the Azure portal." lightbox="../../media/tutorial-python-postgresql-app/deploy-local-git-azure-portal-2.png"::: |
| [!INCLUDE [Deploy local Git Azure portal 3](<./deploy-local-git-azure-portal-3.md>)] | :::image type="content" source="../../media/tutorial-python-postgresql-app/deploy-local-git-azure-portal-3-240px.png" alt-text="A screenshot showing the deployment center after saving and the remote Git URL to use for deployments in the Azure portal." lightbox="../../media/tutorial-python-postgresql-app/deploy-local-git-azure-portal-3.png"::: |
| [!INCLUDE [Deploy local Git Azure portal 4](<./deploy-local-git-azure-portal-4.md>)] | :::image type="content" source="../../media/tutorial-python-postgresql-app/deploy-local-git-azure-portal-4-240px.png" alt-text="A screenshot showing the location of the deployment credentials in the deployment center for an App Service in the Azure portal." lightbox="../../media/tutorial-python-postgresql-app/deploy-local-git-azure-portal-4.png"::: |

### [Azure CLI](#tab/deploy-instructions-azcli)

[!INCLUDE [Deploy local git with CLI](<./deploy-local-git-cli.md>)]

---

Next, in the root directory of your application, configure a [Git remote](https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes) that points to Azure using the Git URL of the Azure remote obtained in a previous step.

```bash
git remote add azure <git-deployment-url>
```

You can now push code from your local Git repository to Azure using the Git remote you configured.

```bash
git push azure main:master
```

The first time you push code to Azure, Git will prompt you for the Azure deployment credentials you obtained in a previous step. Git will then cache these credentials so you won't have to enter them on subsequent deployments.
