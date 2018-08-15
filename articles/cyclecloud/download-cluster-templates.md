---
title: Download Azure CycleCloud Cluster Projects and Templates | Microsoft Docs
description: Azure CycleCloud has built-in templates you can configure and edit to make your own custom templates.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Cluster Template Downloads

Azure CycleCloud comes with built-in cluster templates that you can use out of the box, or customize to [build a template](cluster-templates.md) for your specific needs. For the full list of available cluster templates, please visit [Microsoft Azure GitHub](https://github.com/Azure?utf8=%E2%9C%93&q=cyclecloud&type=&language=) and search for "cyclecloud".

Once your custom template is complete, you can import it into your CycleCloud instance with:

```azurecli-interactive
cyclecloud import_template -f templates/template-name.template.txt
```

## Available Template Type

| Project/Template Type | CycleCloud Project/Template Repo                                             | Description                                                                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [![Blender](~/media/index/blender.png)](https://www.blender.org/)                  | [Blender](https://github.com/Azure/cyclecloud-blender)                       | CycleCloud project. Installs and configures Blender 3D Rendering toolkit for batch rendering; includes example cluster template that installs Blender alongside SGE. |
| logo                  | [BeeGFS](https://github.com/Azure/cyclecloud-beegfs)                         | CycleCloud project to enable configuration, orchestration, and management of BeeGFS file systems in Azure CycleCloud HPC clusters.                                   |
| logo                  | [Conda](https://github.com/Azure/cyclecloud-conda)                           | CycleCloud project to enable use of conda/bioconda/miniconda on Azure CycleCloud HPC clusters.                                                                       |
| logo                  | [Azure Data Science VM](https://github.com/Azure/cyclecloud-data-science-vm) | CycleCloud project to enable running the Azure Data Science VM Marketplace offering instance.                                                                        |
| logo                  | [Docker](https://github.com/Azure/cyclecloud-docker)                         | CycleCloud project to enable use of Docker containers in HPC clusters. Differs from running CycleCloud in a container instance.                                      |
| logo                  | [Gluster](https://github.com/Azure/cyclecloud-gluster)                       | Enables users to provision Gluster file systems as part of HPC clusters in Azure.                                                                                    |
| logo                  | [Grid Engine](https://github.com/Azure/cyclecloud-gridengine)                | Azure CycleCloud GridEngine cluster template.                                                                                                                        |
| logo                  | [HPC Pack](https://github.com/Azure/cyclecloud-hpcpack)                      | CycleCloud project that enables use of Microsoft HPC Pack job scheduler.                                                                                             |
| logo                  | [HTCondor](https://github.com/Azure/cyclecloud-htcondor)                     | Azure CycleCloud HTCondor cluster template.                                                                                                                          |
| logo                  | [Kafka](https://github.com/Azure/cyclecloud-kafka)                           | CycleCloud project to configure and launch a basic Apache Kafka cluster.                                                                                             |
| logo                  | [LAMMPS](https://github.com/Azure/cyclecloud-lammps)                         | CycleCloud project for LAMMPS cluster type.                                                                                                                          |
| logo                  | [Spectrum LSF](https://github.com/Azure/cyclecloud-lsf)                      | CycleCloud project to enable use of Spectrum LSF job scheduler in Azure CycleCloud HPC clusters.                                                                     |
| logo                  | [MrBayes](https://github.com/Azure/cyclecloud-mrbayes)                       | Azure CycleCloud MrBayes cluster template.                                                                                                                           |
| logo                  | [Network File System](https://github.com/Azure/cyclecloud-nfs)               | CycleCloud project to enable use of NFS filers in HPC clusters in Azure.                                                                                             |
| logo                  | [PBSPro](https://github.com/Azure/cyclecloud-pbspro)                         | Azure CycleCloud PBSPro cluster template.                                                                                                                            |
| v                     | [Redis](https://github.com/Azure/cyclecloud-redis)                           | CycleCloud project to configure and launch a basic Redis cluster.                                                                                                    |
| logo                  | [Singularity](https://github.com/Azure/cyclecloud-singularity)               | CycleCloud project to enable use of Singularity containers in HPC clusters in Azure.                                                                                 |
| logo                  | [Slurm](https://github.com/Azure/cyclecloud-slurm)                           | CycleCloud project to enable users to create, configure, and use Slurm HPC clusters.                                                                                 |
| logo                  | [Spectrum Symphony](https://github.com/Azure/cyclecloud-symphony)            | CycleCloud project to enable use of Spectrum Symphony job scheduler in Azure CycleCloud HPC clusters.                                                                |
| logo                  | [Tractor](https://github.com/Azure/cyclecloud-tractor)                       | CycleCloud project to enable running Pixar's Tractor render manager on Azure CycleCloud HPC clusters.                                                                |
| logo                  | [UberCloud](https://github.com/Azure/cyclecloud-ubercloud)                   | CycleCloud project to enable use of UberCloud containers in HPC clusters in Azure.                                                                                   |
| logo                  | [ZooKeeper](https://github.com/Azure/cyclecloud-zookeeper)                   | CycleCloud project to configure and launch a basic Apache ZooKeeper cluster.                                                                                         |                                                   |
