---
title: Use directory groups in Azure HPC Cache
description: How to configure directory services for client access to storage targets in Azure HPC Cache
author: ekpgh
ms.service: hpc-cache
ms.topic: how-to
ms.date: 11/18/2020
ms.author: v-erkel
---

Directory services settings let you configure external sources to authenticate users for accessing back-end storage.

LDAP Server
Enter the fully qualified domain name or IP address for the LDAP server to use. You can enter up to three LDAP servers, separated by spaces.
LDAP Base DN
Specify the base distinguished name for the LDAP domain. LDAP queries are performed on the base DN, the DN of the entry, and all entries below it in the directory tree. Ask your LDAP administrator if you don’t know your base DN.

Base and bind DN entries use a similar format. So, for example, if the domain name is “ourdomain.server.company.com”, the DN entry is in the form ou=ourdomain,dc=server,dc=company,dc=com

Secure Access
Check this box to encrypt LDAP connections with TLS/SSL. After checking this box, two additional options appear:

Require valid certificate - Check this box to accept only externally validated certificates. This option is enabled by default.

CA Certificate URI - This field appears when the Require valid certificate box is checked. Enter the certificate authority information. Check the Auto-download box to attempt to download a certificate as soon as you submit this configuration.

Note If you are using a self-signed certificate, leave the URI field blank and check the auto-download box.

