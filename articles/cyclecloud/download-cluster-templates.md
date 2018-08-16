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

## Available Template Types

| Project/Template Type                                    | CycleCloud Repo                                             | Description                                                                                                                                                          |     |
| -------------------------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| [![Blender](~/media/index/blender.png)](https://blender.org)                 | [Blender](https://github.com/Azure/cyclecloud-blender)                       | CycleCloud project. Installs and configures Blender 3D Rendering toolkit for batch rendering; includes example cluster template that installs Blender alongside SGE. |     |
| ![BeeGFS](~/media/index/beegfs.png)                   | [BeeGFS](https://github.com/Azure/cyclecloud-beegfs)                         | CycleCloud project to enable configuration, orchestration, and management of BeeGFS file systems in Azure CycleCloud HPC clusters.                                   |     |
| ![Conda](~/media/index/conda.png)                     | [Conda](https://github.com/Azure/cyclecloud-conda)                           | CycleCloud project to enable use of conda/bioconda/miniconda on Azure CycleCloud HPC clusters.                                                                       |     |
| ![Azure Data Science](~/media/index/data-science.png) | [Azure Data Science VM](https://github.com/Azure/cyclecloud-data-science-vm) | CycleCloud project to enable running the Azure Data Science VM Marketplace offering instance.                                                                        |     |
| ![Docker](~/media/index/docker.png)                   | [Docker](https://github.com/Azure/cyclecloud-docker)                         | CycleCloud project to enable use of Docker containers in HPC clusters. Differs from running CycleCloud in a container instance.                                      |     |
| ![Gluster](~/media/index/gluster.png)                 | [Gluster](https://github.com/Azure/cyclecloud-gluster)                       | Enables users to provision Gluster file systems as part of HPC clusters in Azure.                                                                                    |     |
| ![Grid Engine](~/media/index/grid-engine.png)         | [Grid Engine](https://github.com/Azure/cyclecloud-gridengine)                | Azure CycleCloud GridEngine cluster template.                                                                                                                        |     |
| ![no logo](~/media/index/default.png)                 | [HPC Pack](https://github.com/Azure/cyclecloud-hpcpack)                      | CycleCloud project that enables use of Microsoft HPC Pack job scheduler.                                                                                             |     |
| ![HTCondor](~/media/index/htcondor.png)               | [HTCondor](https://github.com/Azure/cyclecloud-htcondor)                     | Azure CycleCloud HTCondor cluster template.                                                                                                                          |     |
| ![Kafka](~/media/index/kafka.png)                     | [Kafka](https://github.com/Azure/cyclecloud-kafka)                           | CycleCloud project to configure and launch a basic Apache Kafka cluster.                                                                                             |     |
| ![LAMMPS](~/media/index/lammps.png)                   | [LAMMPS](https://github.com/Azure/cyclecloud-lammps)                         | CycleCloud project for LAMMPS cluster type.                                                                                                                          |     |
| ![no logo](~/media/index/default.png)                 | [Spectrum LSF](https://github.com/Azure/cyclecloud-lsf)                      | CycleCloud project to enable use of Spectrum LSF job scheduler in Azure CycleCloud HPC clusters.                                                                     |     |
| ![MrBayes](~/media/index/mr-bayes.png)                | [MrBayes](https://github.com/Azure/cyclecloud-mrbayes)                       | Azure CycleCloud MrBayes cluster template.                                                                                                                           |     |
| ![NFS](~/media/index/nfs.png)                                                      | [Network File System](https://github.com/Azure/cyclecloud-nfs)               | CycleCloud project to enable use of NFS filers in HPC clusters in Azure.                                                                                             |     |
| ![no logo](~/media/index/default.png)                                                      | [PBSPro](https://github.com/Azure/cyclecloud-pbspro)                         | Azure CycleCloud PBSPro cluster template.                                                                                                                            |     |
| ![Redis](~/media/index/default.png)                                                         | [Redis](https://github.com/Azure/cyclecloud-redis)                           | CycleCloud project to configure and launch a basic Redis cluster.                                                                                                    |     |
| ![Singularity](~/media/index/singularity.png)                                                      | [Singularity](https://github.com/Azure/cyclecloud-singularity)               | CycleCloud project to enable use of Singularity containers in HPC clusters in Azure.                                                                                 |     |
| ![slurm](~/media/index/slurm.png)                                                      | [Slurm](https://github.com/Azure/cyclecloud-slurm)                           | CycleCloud project to enable users to create, configure, and use Slurm HPC clusters.                                                                                 |     |
| ![no logo](~/media/index/default.png)                                                      | [Spectrum Symphony](https://github.com/Azure/cyclecloud-symphony)            | CycleCloud project to enable use of Spectrum Symphony job scheduler in Azure CycleCloud HPC clusters.                                                                |     |
| ![ZooKeeper](~/media/index/zookeeper.png)                                                      | [ZooKeeper](https://github.com/Azure/cyclecloud-zookeeper)                   | CycleCloud project to configure and launch a basic Apache ZooKeeper cluster.                                                                                         |     |
