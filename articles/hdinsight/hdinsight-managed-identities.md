---
title: Managed identities in Azure HDInsight
description: Provides an overview of the implementation of managed identities in Azure HDInsight.
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 05/24/2023
---

# Managed identities in Azure HDInsight

A managed identity is an identity registered in Azure Active Directory (Azure AD) whose credentials are managed by Azure. With managed identities, you don't need to register service principals in Azure AD. Or maintain credentials such as certificates.

Managed identities are used in Azure HDInsight to access Azure AD domain services or access files in Azure Data Lake Storage Gen2 when needed.

There are two types of managed identities: user-assigned and system-assigned. Azure HDInsight supports only user-assigned managed identities. HDInsight doesn't support system-assigned managed identities. A user-assigned managed identity is created as a standalone Azure resource, which you can then assign to one or more Azure service instances. In contrast, a system-assigned managed identity is created in Azure AD and then enabled directly on a particular Azure service instance automatically. The life of that system-assigned managed identity is then tied to the life of the service instance that it's enabled on.

## HDInsight managed identity implementation

In Azure HDInsight, managed identities are only usable by the HDInsight service for internal components. There's currently no supported method to generate access tokens using the managed identities installed on HDInsight cluster nodes for accessing external services. For some Azure services such as compute VMs, managed identities are implemented with an endpoint that you can use to acquire access tokens. This endpoint is currently not available in HDInsight nodes.

If you need to bootstrap your applications to avoid putting secrets/passwords in the analytics jobs (e.g. SCALA jobs), you can distribute your own certificates to the cluster nodes using script actions and then use that certificate to acquire an access token (for example to access Azure KeyVault).

## Create a managed identity

Managed identities can be created with any of the following methods:

* [Azure portal](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md)
* [Azure PowerShell](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-powershell.md)
* [Azure Resource Manager](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-arm.md)
* [Azure CLI](../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli.md)

The remaining steps for configuring the managed identity depend on the scenario where it will be used.

## Managed identity scenarios in Azure HDInsight

Managed identities are used in Azure HDInsight in multiple scenarios. See the related documents for detailed setup and configuration instructions:

* [Azure Data Lake Storage Gen2](hdinsight-hadoop-use-data-lake-storage-gen2-portal.md#create-a-user-assigned-managed-identity)
* [Enterprise Security Package](domain-joined/apache-domain-joined-configure-using-azure-adds.md#create-and-authorize-a-managed-identity)
* [Customer-managed key disk encryption](disk-encryption.md)

HDInsight will automatically renew the certificates for the managed identities you use for these scenarios. However, there is a limitation when multiple different managed identities are used for long running clusters, the certificate renewal may not work as expected for all of the managed identities. Due to this limitation, we recommend to use the same managed identity for all of the above scenarios. 

If you have already created a long running cluster with multiple different managed identities and are running into one of these issues:
 * In ESP clusters, cluster services starts failing or scale up and other operations start failing with authentications errors.
 * In ESP clusters, when changing AAD-DS LDAPS cert, the LDAPS certificate does not automatically get updated and therefore LDAP sync and scale ups start failing.
 * MSI access to ADLS Gen2 start failing.
 * Encryption Keys can not be rotated in the CMK scenario.

then you should assign the required roles and permissions for the above scenarios to all of those managed identities used in the cluster. For example, if you used different managed identities for ADLS Gen2 and ESP clusters then both of them should have the "Storage blob data Owner" and "HDInsight Domain Services Contributor" roles assigned to them to avoid running in to these issues.

## FAQ

### What happens if I delete the managed identity after the cluster creation?

Your cluster will run into issues when the managed identity is needed. There's currently no way to update or change a managed identity after the cluster is created. So our recommendation is to make sure that the managed identity isn't deleted during the cluster runtime. Or you can re-create the cluster and assign a new managed identity.

## Next steps

* [What is managed identities for Azure resources?](../active-directory/managed-identities-azure-resources/overview.md)
