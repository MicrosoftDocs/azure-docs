---
author: baanders
description: include file for Azure Digital Twins tutorials - prerequisite to set up an instance
ms.service: digital-twins
ms.topic: include
ms.date: 5/25/2020
ms.author: baanders
---

### Prepare an Azure Digital Twins instance

To complete this tutorial, you'll need an Azure Digital Twins service instance to program against. 

If you already have an Azure Digital Twins instance set up from previous work, you can use that instance, and skip to the 

[next section](#test-next-section).
[next section](digital-twins-v2-tutorial-prereq-instance.md#test-next-section).

Otherwise, create an instance now using one of these two methods:
* Walk through the setup step-by-step.
    1. Create an instance using the instructions in [How-to: Create an Azure Digital Twins instance](../articles/digital-twins-v2/how-to-set-up-instance.md). 
    2. Set up an Azure Active Directory app registration for your instance with the *Create an app registration* section of [How-to: Authenticate a client application](../articles/digital-twins-v2/how-to-authenticate-client.md#create-an-app-registration).
* Quickly create the instance and AAD app registration by running an automated setup script.
    1. Download the setup script by clicking [this link](https://raw.githubusercontent.com/Azure-Samples/digital-twins-samples/master/scripts/deploy.ps1?token=ANHZCGP3BICWXJPD3GAWXYK63JG6A) to the raw file, and copying the contents into a file on your machine called *deploy.ps1*. 
    2. Open a new [Azure Cloud Shell](https://shell.azure.com/) window in your browser. In Cloud Shell window, click the "Upload/Download files" icon and choose "Upload".

        :::image type="content" source="../articles/digital-twins-v2/media/include-tutorial/upload-extension.png" alt-text="Cloud Shell window showing selection of the Upload option":::

        Navigate to the *deploy.ps1* file you just created and hit "Open."
    3. Run the script with the `./deploy.ps1` command. You will be asked to pass in the following values:
        * For the instance: the *subscription ID* of your Azure subscription to use
        * For the instance: a *resource group* name (you can use an existing resource group, or enter a new name of one to create)
        * For the instance: a *name* for your Azure Digital Twins instance
        * For the app registration: an *AAD application display name* to associate with the registration
        * For the app registration: an *AAD application reply URL* for the AAD application. You can use *http://localhost*.

### Test next section