---
title: Enable SSL on an Azure Machine Learning Compute (MLC) cluster | Microsoft Docs
description: Get instructions for setting up SSL for scoring calls on an Azure Machine Learning Compute (MLC) cluster
services: machine-learning
author: SerinaKaye
ms.author: serinak
manager: hjerez
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 01/24/2018

ROBOTS: NOINDEX
---

# Enable SSL on an Azure Machine Learning Compute (MLC) cluster 

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)]


These instructions allow you to set up SSL for scoring calls on a Machine Learning Compute (MLC) cluster. 

## Prerequisites 

1. Decide on a CNAME (DNS name) to use when making real-time scoring calls.

2. Create a *password-free* certificate with that CNAME.

3. If the certificate is not already in PEM format, convert it to PEM using tools such as *openssl*.

You will have two files after completing the prerequisites:

* A file for the certificate, for example, `cert.pem`. Make sure the file has the full certificate chain.
* A file for the key, for example, `key.pem`



## Set up an SSL certificate on a new ACS cluster

Using the Azure Machine Learning CLI, run the following command with the `-c` switch to create an ACS cluster with an SSL certificate attached:

```
az ml env create -c -g <resource group name> -n <cluster name> --cert-cname <CNAME> --cert-pem <path to cert.pem file> --key-pem <path to key.pem file>
```


## Set up an SSL certificate on an existing ACS cluster

If you are targeting a cluster that was created without SSL, you can add a certificate using Azure PowerShell cmdlets.

You must provide the key and certificate in raw PEM format. These can be read into PowerShell variables:

```
$keyValueInPemFormat = [IO.File]::ReadAllText('<path to key.pem file>')
$certValueInPemFormat = [IO.File]::ReadAllText('<path to cert.pem file>')
```
Add the certificate to the cluster: 

```
Set-AzureRmMlOpCluster -ResourceGroupName my-rg -Name my-cluster -SslStatus Enabled -SslCertificate $certValueInPemFormat -SslKey $keyValueInPemFormat -SslCName foo.mycompany.com
```

## Map the CNAME and the IP Address

Create a mapping between the CNAME you selected in the prerequisites and the IP address of the real-time front-end (FE). To discover the IP address of the FE, run the command below. The output displays a field called "publicIpAddress", which contains the IP address of the real-time cluster front end. Refer to the instructions of your DNS provider to set up a record from the FQDN used in CNAME to the public IP address.



## Auto-detection of a certificate 

When you create a real-time web service using the "`az ml service create realtime`" command, Azure Machine Learning auto-detects the SSL set up on the cluster and automatically sets up the scoring URL with the designated certificate. 

To see the certificate status, run the following command. Notice the "https" prefix of the scoring URI and the CNAME in the host name. 

``` 
az ml service show realtime -n <service name>
{
                "id" : "<your service id>",
                "name" : "<your service name >",
                "state" : "Succeeded",
                "createdAt" : "<datetime>”,
                "updatedAt" : "< datetime>",
                "scoringUri" : "https://<your CNAME>/api/v1/service/<service name>/score"
}
```
