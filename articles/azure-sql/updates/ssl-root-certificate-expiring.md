---
title: Certificate rotation for Azure SQL Database & SQL Managed Instance
description: Learn about the upcoming changes of root certificate changes that will affect Azure SQL Database and Azure SQL Managed Instance
author: srdan-bozovic-msft
ms.author: srbozovi
ms.service: sql-db-mi
ms.subservice: service
ms.topic: conceptual
ms.date: 09/13/2020
---

# Understanding the changes in the Root CA change for Azure SQL Database & SQL Managed Instance

Azure SQL Database & SQL Managed Instance will be changing the root certificate for the client application/driver enabled with SSL, used to establish secure TDS connection. The [current root certificate](https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem) is set to expire October 26, 2020 as part of standard maintenance and security best practices. This article gives you more details about the upcoming changes, the resources that will be affected, and the steps needed to ensure that your application maintains connectivity to your database server.

## What update is going to happen?

[Certificate Authority (CA) Browser forum](https://cabforum.org/) recently published reports of multiple certificates issued by CA vendors to be non-compliant.

As per the industry’s compliance requirements, CA vendors began revoking CA certificates for non-compliant CAs, requiring servers to use certificates issued by compliant CAs, and signed by CA certificates from those compliant CAs. Since Azure SQL Database & SQL Managed Instance currently use one of these non-compliant certificates, which client applications use to validate their SSL connections, we need to ensure that appropriate actions are taken (described below) to minimize the potential impact to your Azure SQL servers.

The new certificate will be used starting October 26, 2020. If you use full validation of the server certificate when connecting from a SQL client (TrustServerCertificate=true), you need to ensure that your SQL client would be able to validate new root certificate before October 26, 2020.

## How do I know if my application might be affected?

All applications that use SSL/TLS and verify the root certificate needs to update the root certificate in order to connect to Azure SQL Database & SQL Managed Instance. 

If you are not using SSL/TLS currently, there is no impact to your application availability. You can verify if your client application is trying to verify root certificate by looking at the connection string. If TrustServerCertificate is explicitly set to true then you are not affected.

If your client driver utilizes OS certificate store, as majority of drivers do, and your OS is regularly maintained this change will likely not affect you, as the root certificate we are switching to should be already available in your Trusted Root Certificate Store. Check for Baltimore CyberDigiCert GlobalRoot G2 and validate it is present.

If your client driver utilizes local file certificate store, to avoid your application’s availability being interrupted due to certificates being unexpectedly revoked, or to update a certificate, which has been revoked, refer to the [**What do I need to do to maintain connectivity**](./ssl-root-certificate-expiring.md#what-do-i-need-to-do-to-maintain-connectivity) section.

## What do I need to do to maintain connectivity

To avoid your application’s availability being interrupted due to certificates being unexpectedly revoked, or to update a certificate, which has been revoked, follow the steps below:

*   Download Baltimore CyberTrust Root & DigiCert GlobalRoot G2 Root CA from links below:
    *   https://www.digicert.com/CACerts/BaltimoreCyberTrustRoot.crt.pem
    *   https://cacerts.digicert.com/DigiCertGlobalRootG2.crt.pem

*   Generate a combined CA certificate store with both **BaltimoreCyberTrustRoot** and **DigiCertGlobalRootG2** certificates are included.

## What can be the impact?
If you are validating server certificates as documented here, your application’s availability might be interrupted since the database will not be reachable. Depending on your application, you may receive a variety of error messages including but not limited to:
*	Invalid certificate/revoked certificate
*	Connection timed out
*	Error if applicable

## Frequently asked questions

### If I am not using SSL/TLS, do I still need to update the root CA?
No actions regarding this change are required if you are not using SSL/TLS. Still you should set a plan for start using latest TLS version as we plan for TLS enforcement in near future.

### What will happen if I do not update the root certificate before October 26, 2020?
If you do not update the root certificate before November 30, 2020, your applications that connect via SSL/TLS and does verification for the root certificate will be unable to communicate to the Azure SQL Database & SQL Managed Instance and application will experience connectivity issues to your Azure SQL Database & SQL Managed Instance.

### Do I need to plan a maintenance downtime for this change?<BR>
No. Since the change here is only on the client side to connect to the server, there is no maintenance downtime needed here for this change.

### What if I cannot get a scheduled downtime for this change before October 26, 2020?
Since the clients used for connecting to the server needs to be updating the certificate information as described in the fix section [here](./ssl-root-certificate-expiring.md#what-do-i-need-to-do-to-maintain-connectivity), we do not need to a downtime for the server in this case.

### If I create a new server after November 30, 2020, will I be impacted?
For servers created after October 26, 2020, you can use the newly issued certificate for your applications to connect using SSL.

### How often does Microsoft update their certificates or what is the expiry policy?
These certificates used by Azure SQL Database & SQL Managed Instance are provided by trusted Certificate Authorities (CA). So the support of these certificates on Azure SQL Database & SQL Managed Instance is tied to the support of these certificates by CA. However, as in this case, there can be unforeseen bugs in these predefined certificates, which need to be fixed at the earliest.

### If I am using read replicas, do I need to perform this update only on primary server or all the read replicas?
Since this update is a client-side change, if the client used to read data from the replica server, we will need to apply the changes for those clients as well. 

### Do we have server-side query to verify if SSL is being used?
Since this configuration is client-side, information is not available on server side.

### What if I have further questions?
If you have a support plan and you need technical help, create Azure support request, see [How to create Azure support request](../../azure-portal/supportability/how-to-create-azure-support-request.md).