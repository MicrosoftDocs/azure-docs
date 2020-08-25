---
title: Manage server - Azure portal - Azure Database for MySQL Flexible Server
description: Learn how to manage an Azure Database for MySQL Flexible server from the Azure portal.
author: mksuni
ms.author: sumuth
ms.service: mysql
ms.topic: how-to
ms.date: 9/22/2020
---

# Manage an Azure Database for MySQL Flexible server using Azure portal
This article shows you how to manage your Azure Database for MySQL Flexible servers. Management tasks include compute and storage scaling, rest server administrator password and delete your server.
## Sign in
Sign in to the [Azure portal](https://portal.azure.com). Go to your flexible server resource in the Azure portal.

## Scale compute and storage

You can scale up or down your server between Burstable, General Purpose and Memory Optimized tiers as your needs change. You can also scale compute and memory by increasing or decreasing vCores. Storage can be scaled up (however, you cannot scale storage down).

### Scale up by changing pricing tier

You can scale up by modifying pricing tier and move from Burstable to General purpose or Memory optimized pricing tiers based on the needs of your application.To learn more, checkout the [pricing details](https://azure.microsoft.com/pricing/details/mysql).

1. Select your server in the Azure portal. Select **Pricing tier**, located in the **Settings** section.

2. Select **General Purpose** or **Memory Optimized**, depending on what you are scaling to.


    > [!NOTE]
    > Changing tiers causes a server restart.

4. Select **OK** to save changes.


### Scale vCores up or down

1. Select your server in the Azure portal. Select **Pricing tier**, located in the **Settings** section.

2. Change the **vCore** setting by moving the slider to your desired value.


    > [!NOTE]
    > Scaling vCores causes a server restart.

3. Select **OK** to save changes.


### Scale storage up

1. Select your server in the Azure portal. Select **Pricing tier**, located in the **Settings** section.

2. Change the **Storage** setting by moving the slider up to your desired value.


    > [!NOTE]
    > Storage cannot be scaled down.

3. Select **OK** to save changes.


## Update admin password
You can change the administrator role's password using the Azure portal. Note if your password is modified you need top update your front end application with the new password.

1. Select your server in the Azure portal. In the **Overview** window select **Reset password**.



2. Enter a new password and confirm the password. The textbox will prompt you about password complexity requirements.



3. Select **OK** to save the new password.

## Delete a server

You can delete your server if you no longer need it.

1. Select your server in the Azure portal. In the **Overview** window select **Delete**.



2. Type the name of the server into the input box to confirm that this is the server you want to delete.


    > [!NOTE]
    > Deleting a server is irreversible.

3. Select **Delete**.



