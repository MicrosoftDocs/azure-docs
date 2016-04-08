<properties
   pageTitle="Install the DC/OS CLI on an Azure Container Service Cluster | Microsoft Azure"
   description="Install the DC/OS CLI on an Azure Container Service Cluster."
   services="container-service"
   documentationCenter=""
   authors="gatneil"
   manager="timlt"
   editor=""
   tags="acs, azure-container-service"
   keywords="Containers, Micro-services, DC/OS, Azure"/>

<tags
   ms.service="container-service"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="02/16/2016"
   ms.author="rogardle"/>



# Install the DC/OS CLI on the DC/OS Preview version of ACS

When you create your DC/OS Preview version of ACS with dnsNamePrefix DNS_NAME_PREFIX and location LOCATION, you get the following FQDN for the load balancer for your masters: DNS_NAME_PREFIXmgmt.LOCATION.westus.cloudapp.azure.com. For example, when I create with dnsNamePrefix "negatacs" and location "wetsus" (or "West US"), the FQDN is: negatacsmgmt.westus.cloudapp.azure.com. This load balancer has NAT rules that map port 2200+i to port 22 on master number 'i'. As an example, I can ssh into the 0th master in my cluster with the following command (assuming my username is 'negat'):

```bash
ssh -p 2200 negat@negatacsmgmt.westus.cloudapp.azure.com
```


