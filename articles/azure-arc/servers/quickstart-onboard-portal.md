---
title: Quickstart - Connect machines to Azure using Azure Arc for servers - Portal
description: In this quickstart you learn how to connect machines to Azure using Azure Arc for servers from the portal
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-servers
author: bobbytreed
ms.author: robreed
keywords: azure automation, DSC, powershell, desired state configuration, update management, change tracking, inventory, runbooks, python, graphical, hybrid, onboard
ms.date: 08/25/2019
ms.custom: mvc
ms.topic: quickstart
---
# Quickstart: Connect machines to Azure using Azure Arc for servers - Portal

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

Review the supported clients and required network configuration in the [Azure Arc for servers Overview](overview.md).

## Generate the agent install script using the Azure portal

1. Launch [https://aka.ms/hybridmachineportal][aka_hybridmachineportal]
1. Click on **+Add**
1. Follow the wizard to completion
1. The last page has a script generated which you can copy (or download).

The script must be run on the target machine you want to connect. It downloads the agent, installs it, and connects the machine as a single operation.

On the Non-Azure servers you want to manage:

1. Logon to the server (using SSH, RDP or PowerShell Remoting)
1. Start a shell: bash on Linux, PowerShell as Administrator on Windows
1. Paste in the script from the portal and execute it on the server to be connected to Azure.
1. The default authentication for onboarding an individual server is *interactive* using Azure 'device login'. When you run the script, you will see a message similar to:

  ```none
  To sign in, use a web browser to open the page https://microsoft.com/devicelogin and enter the code B3V3NLWRF to authenticate.
  ```
  
   Open a browser and enter the code to authenticate. The browser doesn't need to be running on the server you are onboarding, it could be on another computer such as your laptop.

1. If you would like to authenticate non-interactively, follow the steps in [Create a Service Principal](quickstart-onboard-powershell.md#create-a-service-principal-for-onboarding-at-scale) and modify the script generated from the portal.

> [!NOTE]
> If you are using Internet Explorer on the server for the very first time to logon, it will error out. You can just reopen the browser and do it again.

## Execute the script on target nodes

Log in to each Node and execute the script you generated from the portal. After the script completes successfully, go to the Azure portal verify that the server has been successfully connected.

![Successful Onboarding](./media/quickstart-onboard/arc-for-servers-successful-onboard.png)

## Clean up

To disconnect a machine from Azure Arc for servers, you need to perform two steps.

1. Select the machine in [Portal](https://aka.ms/hybridmachineportal), click the ellipsis (`...`) and select **Delete**.
1. Uninstall the agent from the machine.

## Next steps

> [!div class="nextstepaction"]
> [Assign a Policy to Connected Machines](../../governance/policy/assign-policy-portal.md)