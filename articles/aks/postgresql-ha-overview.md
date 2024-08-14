---
title: 'Overview of deploying a highly available PostgreSQL database on AKS with Azure CLI'
description: Learn how to deploy a highly available PostgreSQL database on AKS using the CloudNativePG operator.
ms.topic: overview
ms.date: 06/07/2024
author: kenkilty
ms.author: kkilty
ms.custom: innovation-engine, aks-related-content
#Customer intent: As a developer or cluster operator, I want to deploy a highly available PostgreSQL database on AKS so I can see how to run a stateful database workload using the managed Kubernetes service in Azure.
---
# Deploy a highly available PostgreSQL database on AKS with Azure CLI

In this guide, you deploy a highly available PostgreSQL cluster that spans multiple Azure availability zones on AKS with Azure CLI.

This article walks through the prerequisites for setting up a PostgreSQL cluster on [Azure Kubernetes Service (AKS)][what-is-aks] and provides an overview of the full deployment process and architecture.

[!INCLUDE [open source disclaimer](./includes/open-source-disclaimer.md)]

## Prerequisites

* This guide assumes a basic understanding of [core Kubernetes concepts][core-kubernetes-concepts] and [PostgreSQL][postgresql].
* You need the **Owner** or **User Access Administrator** and the **Contributor** [Azure built-in roles][azure-roles] on a subscription in your Azure account.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

* You also need the following resources installed:

  * [Azure CLI](/cli/azure/install-azure-cli) version 2.56 or later.
  * [Azure Kubernetes Service (AKS) preview extension][aks-preview].
  * [jq][jq], version 1.5 or later.
  * [kubectl][install-kubectl] version 1.21.0 or later.
  * [Helm][install-helm] version 3.0.0 or later.
  * [openssl][install-openssl] version 3.3.0 or later.
  * [Visual Studio Code][install-vscode] or equivalent.
  * [Krew][install-krew] version 0.4.4 or later.
  * [kubectl CloudNativePG (CNPG) Plugin][cnpg-plugin].

## Deployment process

In this guide, you learn how to:

* Use Azure CLI to create a multi-zone AKS cluster.
* Deploy a highly available PostgreSQL cluster and database using the [CNPG operator][cnpg-plugin].
* Set up monitoring for PostgreSQL using Prometheus and Grafana.
* Deploy a sample dataset to a PostgreSQL database.
* Perform PostgreSQL and AKS cluster upgrades.
* Simulate a cluster interruption and PostgreSQL replica failover.
* Perform backup and restore of a PostgreSQL database.

## Deployment architecture

This diagram illustrates a PostgreSQL cluster setup with one primary replica and two read replicas managed by the [CloudNativePG (CNPG)](https://cloudnative-pg.io/) operator. The architecture provides a highly available PostgreSQL running on an AKS cluster that can withstand a zone outage by failing over across replicas.

Backups are stored on [Azure Blob Storage](/azure/storage/blobs/), providing another way to restore the database in the event of an issue with streaming replication from the primary replica.

:::image source="./media/postgresql-ha-overview/architecture-diagram.png" alt-text="Diagram of CNPG architecture." lightbox="./media/postgresql-ha-overview/architecture-diagram.png":::

> [!NOTE]
> The CNPG operator supports only *one database per cluster*. Plan accordingly for applications that require data separation at the database level.

## Next steps

> [!div class="nextstepaction"]
> [Create the infrastructure to deploy a highly available PostgreSQL database on AKS using the CNPG operator][create-infrastructure]

## Contributors

*This article is maintained by Microsoft. It was originally written by the following contributors*:

* Ken Kilty | Principal TPM
* Russell de Pina | Principal TPM
* Adrian Joian | Senior Customer Engineer
* Jenny Hayes | Senior Content Developer
* Carol Smith | Senior Content Developer
* Erin Schaffer | Content Developer 2
* Adam Sharif | Customer Engineer 2

<!-- LINKS -->
[what-is-aks]: ./what-is-aks.md
[postgresql]: https://www.postgresql.org/
[core-kubernetes-concepts]: ./concepts-clusters-workloads.md
[azure-roles]: ../role-based-access-control/built-in-roles.md
[aks-preview]: ./draft.md#install-the-aks-preview-azure-cli-extension
[jq]: https://jqlang.github.io/jq/
[install-kubectl]: https://kubernetes.io/docs/tasks/tools/install-kubectl/
[install-helm]: https://helm.sh/docs/intro/install/
[install-openssl]: https://www.openssl.org/
[install-vscode]: https://code.visualstudio.com/Download
[install-krew]: https://krew.sigs.k8s.io/
[cnpg-plugin]: https://cloudnative-pg.io/documentation/current/kubectl-plugin/#using-krew
[create-infrastructure]: ./create-postgresql-ha.md
