---
author: cephalin
ms.author: cephalin
ms.topic: include
ms.date: 07/07/2022
---
The deployment takes a few minutes to complete, and creates the following resources:

- **Resource group** &rarr; The container for all the created resources.
- **App Service plan** &rarr; Defines the compute resources for App Service. A Linux plan in the *P1v2* tier is created.
- **App Service** &rarr; Represents your app and runs in the App Service plan.
- **Virtual network** &rarr; Integrated with the App Service app and isolates back-end network traffic.
- **Azure Database for MySQL - Flexible Server** &rarr; Accessible only from the virtual network. A database and a user are created for you on the server.
- **Private DNS zone** &rarr; Enables DNS resolution of the MySQL database server in the virtual network.

Once deployment completes, click the **Go to resource** button. You're taken directly to the App Service app.