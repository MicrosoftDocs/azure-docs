<properties
   pageTitle="How to enable Azure Enhanced Monitoring on Linux virtual machines (VMs) | Microsoft Azure"
   description="How to enable Azure Enhanced Monitoring on Linux virtual machines (VMs) in Microsoft Azure"
   services="virtual-machines-linux"
   documentationCenter="saponazure"
   authors="MSSedusch"
   manager="juergent"
   editor=""
   tags="azure-resource-manager"
   keywords=""/>
<tags
   ms.service="virtual-machines-linux"
   ms.devlang="NA"
   ms.topic="campaign-page"
   ms.tgt_pltfrm="vm-linux"
   ms.workload="na"
   ms.date="05/17/2016"
   ms.author="sedusch"/>

# How to enable Azure Enhanced Monitoring on Linux VM
[azure-cli]:../xplat-cli-install.md

This is an instruction about how to enable Azure Enhanced Monitoring(AEM) on Azure Linux VM. 

## Install Azure CLI

First of all, you need to to install [Azure CLI][azure-cli]

## Configure Azure Enhanced Monitoring

1. Login with your Azure account

    ```
    azure login
    ```
2. Switch to Azure Resource Manager mode

    ```
    azure config mode arm
    ```
3. Enable Azure Enhanced Monitoring

    ```
    azure vm enable-aem <resource-group-name> <vm-name>
    ```  
4. Verify that the Azure Enhanced Monitoring is active on the Azure Linux VM. Check if the file  /var/lib/AzureEnhancedMonitor/PerfCounters exists. If exists, display information collected by AEM with:

    ```
    cat /var/lib/AzureEnhancedMonitor/PerfCounters
    ```
    Then you will get output like:
    
    ```
    2;cpu;Current Hw Frequency;;0;2194.659;MHz;60;1444036656;saplnxmon;
    2;cpu;Max Hw Frequency;;0;2194.659;MHz;0;1444036656;saplnxmon;
    …
    …
    ```