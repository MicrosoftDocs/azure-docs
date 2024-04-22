---
title: Oracle solutions on Azure virtual machines | Microsoft Docs
description: Learn about supported configurations and limitations of Oracle virtual machine images on Microsoft Azure.
author: jjaygbay1
ms.service: virtual-machines
ms.subservice: oracle
ms.custom:
ms.collection: linux
ms.topic: article
ms.date: 04/11/2023
ms.author: jacobjaygbay
---
# Oracle VM images and their deployment on Microsoft Azure

**Applies to:** :heavy_check_mark: Linux VMs

This article covers information about Oracle solutions based on virtual machine (VM) images published by Oracle in the Azure Marketplace. If you're interested in cross-cloud application solutions with Oracle Cloud Infrastructure, see [Oracle application solutions integrating Microsoft Azure and Oracle Cloud Infrastructure](oracle-oci-overview.md).

To get a list of currently available images, run the following command:

```azurecli-interactive
az vm image list --publisher oracle --output table --all
```

As of April 2023, the following images are available:

```output
Architecture    Offer                         Publisher    Sku                       Urn                                                                 Version
--------------  ----------------------------  -----------  ------------------------  ------------------------------------------------------------------  -------------
x64             ohs-122140-jdk8-ol73          Oracle       ohs-122140-jdk8-ol73      Oracle:ohs-122140-jdk8-ol73:ohs-122140-jdk8-ol73:1.1.2              1.1.2
x64             ohs-122140-jdk8-ol74          Oracle       ohs-122140-jdk8-ol74      Oracle:ohs-122140-jdk8-ol74:ohs-122140-jdk8-ol74:1.1.2              1.1.2
x64             ohs-122140-jdk8-ol76          Oracle       ohs-122140-jdk8-ol76      Oracle:ohs-122140-jdk8-ol76:ohs-122140-jdk8-ol76:1.1.2              1.1.2
x64             oracle-database               Oracle       oracle_db_12_2_0_1_ee     Oracle:oracle-database:oracle_db_12_2_0_1_ee:12.2.01                12.2.01
x64             oracle-database               Oracle       oracle_db_12_2_0_1_se     Oracle:oracle-database:oracle_db_12_2_0_1_se:12.2.01                12.2.01
x64             oracle-database               Oracle       oracle_db_21              Oracle:oracle-database:oracle_db_21:21.0.0                          21.0.0
x64             oracle-database-19-3          Oracle       oracle-database-19-0904   Oracle:oracle-database-19-3:oracle-database-19-0904:19.3.1          19.3.1
x64             Oracle-Database-Ee            Oracle       12.1.0.2                  Oracle:Oracle-Database-Ee:12.1.0.2:12.1.20170220                    12.1.20170220
x64             Oracle-Database-Ee            Oracle       18.3.0.0                  Oracle:Oracle-Database-Ee:18.3.0.0:18.3.20181213                    18.3.20181213
x64             Oracle-Database-Se            Oracle       12.1.0.2                  Oracle:Oracle-Database-Se:12.1.0.2:12.1.20170220                    12.1.20170220
x64             Oracle-Database-Se            Oracle       18.3.0.0                  Oracle:Oracle-Database-Se:18.3.0.0:18.3.20181213                    18.3.20181213
x64             Oracle-Linux                  Oracle       6.10                      Oracle:Oracle-Linux:6.10:6.10.00                                    6.10.00
x64             Oracle-Linux                  Oracle       6.8                       Oracle:Oracle-Linux:6.8:6.8.0                                       6.8.0
x64             Oracle-Linux                  Oracle       6.8                       Oracle:Oracle-Linux:6.8:6.8.20190529                                6.8.20190529
x64             Oracle-Linux                  Oracle       6.9                       Oracle:Oracle-Linux:6.9:6.9.0                                       6.9.0
x64             Oracle-Linux                  Oracle       6.9                       Oracle:Oracle-Linux:6.9:6.9.20190529                                6.9.20190529
x64             Oracle-Linux                  Oracle       7.3                       Oracle:Oracle-Linux:7.3:7.3.0                                       7.3.0
x64             Oracle-Linux                  Oracle       7.3                       Oracle:Oracle-Linux:7.3:7.3.20190529                                7.3.20190529
x64             Oracle-Linux                  Oracle       7.4                       Oracle:Oracle-Linux:7.4:7.4.1                                       7.4.1
x64             Oracle-Linux                  Oracle       7.4                       Oracle:Oracle-Linux:7.4:7.4.20190529                                7.4.20190529
x64             Oracle-Linux                  Oracle       7.5                       Oracle:Oracle-Linux:7.5:7.5.1                                       7.5.1
x64             Oracle-Linux                  Oracle       7.5                       Oracle:Oracle-Linux:7.5:7.5.2                                       7.5.2
x64             Oracle-Linux                  Oracle       7.5                       Oracle:Oracle-Linux:7.5:7.5.20181207                                7.5.20181207
x64             Oracle-Linux                  Oracle       7.5                       Oracle:Oracle-Linux:7.5:7.5.20190529                                7.5.20190529
x64             Oracle-Linux                  Oracle       7.5                       Oracle:Oracle-Linux:7.5:7.5.3                                       7.5.3
x64             Oracle-Linux                  Oracle       7.6                       Oracle:Oracle-Linux:7.6:7.6.2                                       7.6.2
x64             Oracle-Linux                  Oracle       7.6                       Oracle:Oracle-Linux:7.6:7.6.3                                       7.6.3
x64             Oracle-Linux                  Oracle       7.6                       Oracle:Oracle-Linux:7.6:7.6.4                                       7.6.4
x64             Oracle-Linux                  Oracle       7.6                       Oracle:Oracle-Linux:7.6:7.6.5                                       7.6.5
x64             Oracle-Linux                  Oracle       77                        Oracle:Oracle-Linux:77:7.7.1                                        7.7.1
x64             Oracle-Linux                  Oracle       77                        Oracle:Oracle-Linux:77:7.7.2                                        7.7.2
x64             Oracle-Linux                  Oracle       77                        Oracle:Oracle-Linux:77:7.7.3                                        7.7.3
x64             Oracle-Linux                  Oracle       77                        Oracle:Oracle-Linux:77:7.7.4                                        7.7.4
x64             Oracle-Linux                  Oracle       77                        Oracle:Oracle-Linux:77:7.7.5                                        7.7.5
x64             Oracle-Linux                  Oracle       77                        Oracle:Oracle-Linux:77:7.7.6                                        7.7.6
x64             Oracle-Linux                  Oracle       77-ci                     Oracle:Oracle-Linux:77-ci:7.7.01                                    7.7.01
x64             Oracle-Linux                  Oracle       77-ci                     Oracle:Oracle-Linux:77-ci:7.7.02                                    7.7.02
x64             Oracle-Linux                  Oracle       77-ci                     Oracle:Oracle-Linux:77-ci:7.7.03                                    7.7.03
x64             Oracle-Linux                  Oracle       78                        Oracle:Oracle-Linux:78:7.8.3                                        7.8.3
x64             Oracle-Linux                  Oracle       78                        Oracle:Oracle-Linux:78:7.8.5                                        7.8.5
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.11                                  7.9.11
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.12                                  7.9.12
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.13                                  7.9.13
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.14                                  7.9.14
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.15                                  7.9.15
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.16                                  7.9.16
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.17                                  7.9.17
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.18                                  7.9.18
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.19                                  7.9.19
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.20                                  7.9.20
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.21                                  7.9.21
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.22                                  7.9.22
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.23                                  7.9.23
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.24                                  7.9.24
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.25                                  7.9.25
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.26                                  7.9.26
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.27                                  7.9.27
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.28                                  7.9.28
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.30                                  7.9.30
x64             Oracle-Linux                  Oracle       79-gen2                   Oracle:Oracle-Linux:79-gen2:7.9.31                                  7.9.31
x64             Oracle-Linux                  Oracle       8                         Oracle:Oracle-Linux:8:8.0.2                                         8.0.2
x64             Oracle-Linux                  Oracle       8-ci                      Oracle:Oracle-Linux:8-ci:8.0.11                                     8.0.11
x64             Oracle-Linux                  Oracle       81                        Oracle:Oracle-Linux:81:8.1.0                                        8.1.0
x64             Oracle-Linux                  Oracle       81                        Oracle:Oracle-Linux:81:8.1.2                                        8.1.2
x64             Oracle-Linux                  Oracle       81-ci                     Oracle:Oracle-Linux:81-ci:8.1.0                                     8.1.0
x64             Oracle-Linux                  Oracle       81-gen2                   Oracle:Oracle-Linux:81-gen2:8.1.11                                  8.1.11
x64             Oracle-Linux                  Oracle       ol77-ci-gen2              Oracle:Oracle-Linux:ol77-ci-gen2:7.7.1                              7.7.1
x64             Oracle-Linux                  Oracle       ol77-gen2                 Oracle:Oracle-Linux:ol77-gen2:7.7.01                                7.7.01
x64             Oracle-Linux                  Oracle       ol77-gen2                 Oracle:Oracle-Linux:ol77-gen2:7.7.02                                7.7.02
x64             Oracle-Linux                  Oracle       ol77-gen2                 Oracle:Oracle-Linux:ol77-gen2:7.7.03                                7.7.03
x64             Oracle-Linux                  Oracle       ol78-gen2                 Oracle:Oracle-Linux:ol78-gen2:7.8.03                                7.8.03
x64             Oracle-Linux                  Oracle       ol78-gen2                 Oracle:Oracle-Linux:ol78-gen2:7.8.05                                7.8.05
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.1                                      7.9.1
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.10                                     7.9.10
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.11                                     7.9.11
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.12                                     7.9.12
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.13                                     7.9.13
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.14                                     7.9.14
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.2                                      7.9.2
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.25                                     7.9.25
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.26                                     7.9.26
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.27                                     7.9.27
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.28                                     7.9.28
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.3                                      7.9.3
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.30                                     7.9.30
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.31                                     7.9.31
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.4                                      7.9.4
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.5                                      7.9.5
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.6                                      7.9.6
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.7                                      7.9.7
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.8                                      7.9.8
x64             Oracle-Linux                  Oracle       ol79                      Oracle:Oracle-Linux:ol79:7.9.9                                      7.9.9
x64             Oracle-Linux                  Oracle       ol79-gen2                 Oracle:Oracle-Linux:ol79-gen2:7.9.11                                7.9.11
x64             Oracle-Linux                  Oracle       ol79-lvm                  Oracle:Oracle-Linux:ol79-lvm:7.9.01                                 7.9.01
x64             Oracle-Linux                  Oracle       ol79-lvm-gen2             Oracle:Oracle-Linux:ol79-lvm-gen2:7.9.11                            7.9.11
x64             Oracle-Linux                  Oracle       ol82                      Oracle:Oracle-Linux:ol82:8.2.1                                      8.2.1
x64             Oracle-Linux                  Oracle       ol82                      Oracle:Oracle-Linux:ol82:8.2.3                                      8.2.3
x64             Oracle-Linux                  Oracle       ol82-gen2                 Oracle:Oracle-Linux:ol82-gen2:8.2.01                                8.2.01
x64             Oracle-Linux                  Oracle       ol83-lvm                  Oracle:Oracle-Linux:ol83-lvm:8.3.1                                  8.3.1
x64             Oracle-Linux                  Oracle       ol83-lvm                  Oracle:Oracle-Linux:ol83-lvm:8.3.2                                  8.3.2
x64             Oracle-Linux                  Oracle       ol83-lvm                  Oracle:Oracle-Linux:ol83-lvm:8.3.3                                  8.3.3
x64             Oracle-Linux                  Oracle       ol83-lvm                  Oracle:Oracle-Linux:ol83-lvm:8.3.4                                  8.3.4
x64             Oracle-Linux                  Oracle       ol83-lvm-gen2             Oracle:Oracle-Linux:ol83-lvm-gen2:8.3.11                            8.3.11
x64             Oracle-Linux                  Oracle       ol83-lvm-gen2             Oracle:Oracle-Linux:ol83-lvm-gen2:8.3.12                            8.3.12
x64             Oracle-Linux                  Oracle       ol83-lvm-gen2             Oracle:Oracle-Linux:ol83-lvm-gen2:8.3.13                            8.3.13
x64             Oracle-Linux                  Oracle       ol83-lvm-gen2             Oracle:Oracle-Linux:ol83-lvm-gen2:8.3.14                            8.3.14
x64             Oracle-Linux                  Oracle       ol84-lvm                  Oracle:Oracle-Linux:ol84-lvm:8.4.1                                  8.4.1
x64             Oracle-Linux                  Oracle       ol84-lvm                  Oracle:Oracle-Linux:ol84-lvm:8.4.2                                  8.4.2
x64             Oracle-Linux                  Oracle       ol84-lvm                  Oracle:Oracle-Linux:ol84-lvm:8.4.3                                  8.4.3
x64             Oracle-Linux                  Oracle       ol84-lvm                  Oracle:Oracle-Linux:ol84-lvm:8.4.4                                  8.4.4
x64             Oracle-Linux                  Oracle       ol84-lvm-gen2             Oracle:Oracle-Linux:ol84-lvm-gen2:8.4.11                            8.4.11
x64             Oracle-Linux                  Oracle       ol84-lvm-gen2             Oracle:Oracle-Linux:ol84-lvm-gen2:8.4.12                            8.4.12
x64             Oracle-Linux                  Oracle       ol84-lvm-gen2             Oracle:Oracle-Linux:ol84-lvm-gen2:8.4.13                            8.4.13
x64             Oracle-Linux                  Oracle       ol84-lvm-gen2             Oracle:Oracle-Linux:ol84-lvm-gen2:8.4.14                            8.4.14
x64             Oracle-Linux                  Oracle       ol85-lvm                  Oracle:Oracle-Linux:ol85-lvm:8.5.1                                  8.5.1
x64             Oracle-Linux                  Oracle       ol85-lvm                  Oracle:Oracle-Linux:ol85-lvm:8.5.2                                  8.5.2
x64             Oracle-Linux                  Oracle       ol85-lvm                  Oracle:Oracle-Linux:ol85-lvm:8.5.4                                  8.5.4
x64             Oracle-Linux                  Oracle       ol85-lvm                  Oracle:Oracle-Linux:ol85-lvm:8.5.5                                  8.5.5
x64             Oracle-Linux                  Oracle       ol85-lvm                  Oracle:Oracle-Linux:ol85-lvm:8.5.6                                  8.5.6
x64             Oracle-Linux                  Oracle       ol85-lvm                  Oracle:Oracle-Linux:ol85-lvm:8.5.7                                  8.5.7
x64             Oracle-Linux                  Oracle       ol85-lvm-gen2             Oracle:Oracle-Linux:ol85-lvm-gen2:8.5.11                            8.5.11
x64             Oracle-Linux                  Oracle       ol85-lvm-gen2             Oracle:Oracle-Linux:ol85-lvm-gen2:8.5.12                            8.5.12
x64             Oracle-Linux                  Oracle       ol85-lvm-gen2             Oracle:Oracle-Linux:ol85-lvm-gen2:8.5.14                            8.5.14
x64             Oracle-Linux                  Oracle       ol85-lvm-gen2             Oracle:Oracle-Linux:ol85-lvm-gen2:8.5.15                            8.5.15
x64             Oracle-Linux                  Oracle       ol85-lvm-gen2             Oracle:Oracle-Linux:ol85-lvm-gen2:8.5.16                            8.5.16
x64             Oracle-Linux                  Oracle       ol85-lvm-gen2             Oracle:Oracle-Linux:ol85-lvm-gen2:8.5.17                            8.5.17
x64             Oracle-Linux                  Oracle       ol86-lvm                  Oracle:Oracle-Linux:ol86-lvm:8.6.1                                  8.6.1
x64             Oracle-Linux                  Oracle       ol86-lvm                  Oracle:Oracle-Linux:ol86-lvm:8.6.3                                  8.6.3
x64             Oracle-Linux                  Oracle       ol86-lvm                  Oracle:Oracle-Linux:ol86-lvm:8.6.4                                  8.6.4
x64             Oracle-Linux                  Oracle       ol86-lvm                  Oracle:Oracle-Linux:ol86-lvm:8.6.5                                  8.6.5
x64             Oracle-Linux                  Oracle       ol86-lvm-gen2             Oracle:Oracle-Linux:ol86-lvm-gen2:8.6.1                             8.6.1
x64             Oracle-Linux                  Oracle       ol86-lvm-gen2             Oracle:Oracle-Linux:ol86-lvm-gen2:8.6.3                             8.6.3
x64             Oracle-Linux                  Oracle       ol86-lvm-gen2             Oracle:Oracle-Linux:ol86-lvm-gen2:8.6.4                             8.6.4
x64             Oracle-Linux                  Oracle       ol86-lvm-gen2             Oracle:Oracle-Linux:ol86-lvm-gen2:8.6.5                             8.6.5
x64             Oracle-Linux                  Oracle       ol87-lvm                  Oracle:Oracle-Linux:ol87-lvm:8.7.1                                  8.7.1
x64             Oracle-Linux                  Oracle       ol87-lvm                  Oracle:Oracle-Linux:ol87-lvm:8.7.2                                  8.7.2
x64             Oracle-Linux                  Oracle       ol87-lvm-gen2             Oracle:Oracle-Linux:ol87-lvm-gen2:8.7.1                             8.7.1
x64             Oracle-Linux                  Oracle       ol87-lvm-gen2             Oracle:Oracle-Linux:ol87-lvm-gen2:8.7.2                             8.7.2
x64             Oracle-Linux                  Oracle       ol8_2-gen2                Oracle:Oracle-Linux:ol8_2-gen2:8.2.13                               8.2.13
x64             Oracle-Linux                  Oracle       ol9-lvm                   Oracle:Oracle-Linux:ol9-lvm:9.0.1                                   9.0.1
x64             Oracle-Linux                  Oracle       ol9-lvm                   Oracle:Oracle-Linux:ol9-lvm:9.0.2                                   9.0.2
x64             Oracle-Linux                  Oracle       ol9-lvm                   Oracle:Oracle-Linux:ol9-lvm:9.0.3                                   9.0.3
x64             Oracle-Linux                  Oracle       ol9-lvm-gen2              Oracle:Oracle-Linux:ol9-lvm-gen2:9.0.1                              9.0.1
x64             Oracle-Linux                  Oracle       ol9-lvm-gen2              Oracle:Oracle-Linux:ol9-lvm-gen2:9.0.2                              9.0.2
x64             Oracle-Linux                  Oracle       ol9-lvm-gen2              Oracle:Oracle-Linux:ol9-lvm-gen2:9.0.3                              9.0.3
x64             Oracle-Linux                  Oracle       ol91-lvm                  Oracle:Oracle-Linux:ol91-lvm:9.1.1                                  9.1.1
x64             Oracle-Linux                  Oracle       ol91-lvm                  Oracle:Oracle-Linux:ol91-lvm:9.1.2                                  9.1.2
x64             Oracle-Linux                  Oracle       ol91-lvm-gen2             Oracle:Oracle-Linux:ol91-lvm-gen2:9.1.1                             9.1.1
x64             Oracle-Linux                  Oracle       ol91-lvm-gen2             Oracle:Oracle-Linux:ol91-lvm-gen2:9.1.2                             9.1.2
x64             oracle_sd-wan_edge            Oracle       oracle_sdwan_edge_91000   Oracle:oracle_sd-wan_edge:oracle_sdwan_edge_91000:8.4.0             8.4.0
x64             oracle_virtual_esbc           Oracle       oracle_evsbc_84007        Oracle:oracle_virtual_esbc:oracle_evsbc_84007:8.4.0                 8.4.0
x64             oracle_virtual_esbc           Oracle       oracle_evsbc_90001        Oracle:oracle_virtual_esbc:oracle_evsbc_90001:9.0.0                 9.0.0
x64             oracle_virtual_esbc           Oracle       oracle_evsbc_91004        Oracle:oracle_virtual_esbc:oracle_evsbc_91004:9.1.4                 9.1.4
x64             weblogic-122130-jdk8-ol73     Oracle       owls-122130-jdk8-ol73     Oracle:weblogic-122130-jdk8-ol73:owls-122130-jdk8-ol73:1.1.2        1.1.2
x64             weblogic-122130-jdk8-ol73     Oracle       owls-122130-jdk8-ol73     Oracle:weblogic-122130-jdk8-ol73:owls-122130-jdk8-ol73:1.1.3        1.1.3
x64             weblogic-122130-jdk8-ol73     Oracle       owls-122130-jdk8-ol73     Oracle:weblogic-122130-jdk8-ol73:owls-122130-jdk8-ol73:1.1.4        1.1.4
x64             weblogic-122130-jdk8-ol73     Oracle       owls-122130-jdk8-ol73     Oracle:weblogic-122130-jdk8-ol73:owls-122130-jdk8-ol73:1.1.5        1.1.5
x64             weblogic-122130-jdk8-ol73     Oracle       owls-122130-jdk8-ol73     Oracle:weblogic-122130-jdk8-ol73:owls-122130-jdk8-ol73:1.1.6        1.1.6
x64             weblogic-122130-jdk8-ol74     Oracle       owls-122130-jdk8-ol74     Oracle:weblogic-122130-jdk8-ol74:owls-122130-jdk8-ol74:1.1.2        1.1.2
x64             weblogic-122130-jdk8-ol74     Oracle       owls-122130-jdk8-ol74     Oracle:weblogic-122130-jdk8-ol74:owls-122130-jdk8-ol74:1.1.3        1.1.3
x64             weblogic-122130-jdk8-ol74     Oracle       owls-122130-jdk8-ol74     Oracle:weblogic-122130-jdk8-ol74:owls-122130-jdk8-ol74:1.1.4        1.1.4
x64             weblogic-122130-jdk8-ol74     Oracle       owls-122130-jdk8-ol74     Oracle:weblogic-122130-jdk8-ol74:owls-122130-jdk8-ol74:1.1.5        1.1.5
x64             weblogic-122130-jdk8-ol74     Oracle       owls-122130-jdk8-ol74     Oracle:weblogic-122130-jdk8-ol74:owls-122130-jdk8-ol74:1.1.6        1.1.6
x64             weblogic-122140-jdk8-ol76     Oracle       owls-122140-jdk8-ol76     Oracle:weblogic-122140-jdk8-ol76:owls-122140-jdk8-ol76:1.1.3        1.1.3
x64             weblogic-122140-jdk8-ol76     Oracle       owls-122140-jdk8-ol76     Oracle:weblogic-122140-jdk8-ol76:owls-122140-jdk8-ol76:1.1.4        1.1.4
x64             weblogic-122140-jdk8-ol76     Oracle       owls-122140-jdk8-ol76     Oracle:weblogic-122140-jdk8-ol76:owls-122140-jdk8-ol76:1.1.5        1.1.5
x64             weblogic-122140-jdk8-ol76     Oracle       owls-122140-jdk8-ol76     Oracle:weblogic-122140-jdk8-ol76:owls-122140-jdk8-ol76:1.1.6        1.1.6
x64             weblogic-122140-jdk8-ol76     Oracle       owls-122140-jdk8-ol76     Oracle:weblogic-122140-jdk8-ol76:owls-122140-jdk8-ol76:1.1.7        1.1.7
x64             weblogic-122140-jdk8-rhel76   Oracle       owls-122140-jdk8-rhel76   Oracle:weblogic-122140-jdk8-rhel76:owls-122140-jdk8-rhel76:1.1.1    1.1.1
x64             weblogic-122140-jdk8-rhel76   Oracle       owls-122140-jdk8-rhel76   Oracle:weblogic-122140-jdk8-rhel76:owls-122140-jdk8-rhel76:1.1.2    1.1.2
x64             weblogic-122140-jdk8-rhel76   Oracle       owls-122140-jdk8-rhel76   Oracle:weblogic-122140-jdk8-rhel76:owls-122140-jdk8-rhel76:1.1.3    1.1.3
x64             weblogic-141100-jdk11-ol76    Oracle       owls-141100-jdk11-ol76    Oracle:weblogic-141100-jdk11-ol76:owls-141100-jdk11-ol76:1.1.2      1.1.2
x64             weblogic-141100-jdk11-ol76    Oracle       owls-141100-jdk11-ol76    Oracle:weblogic-141100-jdk11-ol76:owls-141100-jdk11-ol76:1.1.3      1.1.3
x64             weblogic-141100-jdk11-ol76    Oracle       owls-141100-jdk11-ol76    Oracle:weblogic-141100-jdk11-ol76:owls-141100-jdk11-ol76:1.1.4      1.1.4
x64             weblogic-141100-jdk11-ol76    Oracle       owls-141100-jdk11-ol76    Oracle:weblogic-141100-jdk11-ol76:owls-141100-jdk11-ol76:1.1.5      1.1.5
x64             weblogic-141100-jdk11-ol76    Oracle       owls-141100-jdk11-ol76    Oracle:weblogic-141100-jdk11-ol76:owls-141100-jdk11-ol76:1.1.6      1.1.6
x64             weblogic-141100-jdk11-rhel76  Oracle       owls-141100-jdk11-rhel76  Oracle:weblogic-141100-jdk11-rhel76:owls-141100-jdk11-rhel76:1.1.1  1.1.1
x64             weblogic-141100-jdk11-rhel76  Oracle       owls-141100-jdk11-rhel76  Oracle:weblogic-141100-jdk11-rhel76:owls-141100-jdk11-rhel76:1.1.2  1.1.2
x64             weblogic-141100-jdk11-rhel76  Oracle       owls-141100-jdk11-rhel76  Oracle:weblogic-141100-jdk11-rhel76:owls-141100-jdk11-rhel76:1.1.3  1.1.3
x64             weblogic-141100-jdk8-ol76     Oracle       owls-141100-jdk8-ol76     Oracle:weblogic-141100-jdk8-ol76:owls-141100-jdk8-ol76:1.1.2        1.1.2
x64             weblogic-141100-jdk8-ol76     Oracle       owls-141100-jdk8-ol76     Oracle:weblogic-141100-jdk8-ol76:owls-141100-jdk8-ol76:1.1.3        1.1.3
x64             weblogic-141100-jdk8-ol76     Oracle       owls-141100-jdk8-ol76     Oracle:weblogic-141100-jdk8-ol76:owls-141100-jdk8-ol76:1.1.4        1.1.4
x64             weblogic-141100-jdk8-ol76     Oracle       owls-141100-jdk8-ol76     Oracle:weblogic-141100-jdk8-ol76:owls-141100-jdk8-ol76:1.1.5        1.1.5
x64             weblogic-141100-jdk8-ol76     Oracle       owls-141100-jdk8-ol76     Oracle:weblogic-141100-jdk8-ol76:owls-141100-jdk8-ol76:1.1.6        1.1.6
x64             weblogic-141100-jdk8-rhel76   Oracle       owls-141100-jdk8-rhel76   Oracle:weblogic-141100-jdk8-rhel76:owls-141100-jdk8-rhel76:1.1.1    1.1.1
x64             weblogic-141100-jdk8-rhel76   Oracle       owls-141100-jdk8-rhel76   Oracle:weblogic-141100-jdk8-rhel76:owls-141100-jdk8-rhel76:1.1.2    1.1.2
x64             weblogic-141100-jdk8-rhel76   Oracle       owls-141100-jdk8-rhel76   Oracle:weblogic-141100-jdk8-rhel76:owls-141100-jdk8-rhel76:1.1.3    1.1.3
```

These images are bring-your-own-license. You're charged only for compute, storage, and networking costs incurred by running a VM.  You must have the proper licensed to use Oracle software and have a current support agreement in place with Oracle. Oracle has guaranteed license mobility from on-premises to Azure. For more information about license mobility, see [Oracle and Microsoft Strategic Partnership FAQ](https://www.oracle.com/technetwork/topics/cloud/faq-1963009.html).

You can also choose to base your solutions on a custom image that you create from scratch in Azure or upload a custom image from your on-premises environment.

## Oracle database VM images

Oracle supports running Oracle Database 12.1 and higher Standard and Enterprise editions in Azure on VM images based on Oracle Linux. For the best performance for production workloads of Oracle Database on Azure, be sure to properly size the VM image and use Premium SSD or Ultra SSD Managed Disks. For instructions on how to quickly get an Oracle Database up and running in Azure using the Oracle published VM image, see [Create an Oracle Database in an Azure VM](oracle-database-quick-create.md).

### Attached disk configuration options

Attached disks rely on the Azure Blob storage service. Each standard disk is capable of a theoretical maximum of approximately 500 input/output operations per second (IOPS). Our premium disk offering is preferred for high-performance database workloads and can achieve up to 5000 IOPS per disk.

You can use a single disk if that meets your performance needs. However, you can improve the effective IOPS performance if you use multiple attached disks, spread database data across them, and then use Oracle Automatic Storage Management (ASM). For more information, see [The Foundation for Oracle Storage Management](https://www.oracle.com/technetwork/database/index-100339.html). For an example of how to install and configure Oracle ASM on a Linux Azure VM, see [Set up Oracle ASM on an Azure Linux virtual machine](configure-oracle-asm.md).

### Shared storage configuration options

Azure NetApp Files was designed to run high-performance workloads like databases in the cloud. The service provides the following advantages:

- Azure native shared NFS storage service for running Oracle workloads either through VM native NFS client, or Oracle dNFS
- Scalable performance tiers that reflect the real-world range of IOPS demands
- Low latency
- High availability, high durability, and manageability at scale, typically demanded by mission critical enterprise workloads, like SAP and Oracle
- Fast and efficient backup and recovery, to achieve the most aggressive RTO and RPO SLAs

These capabilities are possible because Azure NetApp Files is based on NetApp® ONTAP® all-flash systems that run in Azure data center environment as an Azure Native service. The result is an ideal database storage technology that can be provisioned and consumed just like other Azure storage options. For more information on how to deploy and access Azure NetApp Files NFS volumes, see [Azure NetApp Files](../../../azure-netapp-files/index.yml). For best practice recommendations for operating an Oracle database on Azure NetApp Files, see [Oracle Solutions Using Azure NetApp Files](../../../azure-netapp-files/azure-netapp-files-solution-architectures.md#oracle).

> [!IMPORTANT]
> Customers using Oracle 19c and higher must ensure they are **patched for Oracle bug 32931941, 33132050 and 33676296**, as per [Are there any Oracle patches required with dNFS?](../../../azure-netapp-files/faq-nfs.md#are-there-any-oracle-patches-required-with-dnfs).

## Licensing Oracle Database and software on Azure

Microsoft Azure is an authorized cloud environment for running Oracle Database. The Oracle Core Factor table isn't applicable when licensing Oracle databases in the cloud. Instead, when using VMs with Hyper-Threading Technology enabled for Enterprise Edition databases, count two vCPUs as equivalent to one Oracle Processor license if hyperthreading is enabled, as stated in the policy document. The policy details can be found at [Licensing Oracle Software in the Cloud Computing Environment](http://www.oracle.com/us/corporate/pricing/cloud-licensing-070579.pdf).

Oracle databases generally require higher memory and I/O. For this reason, we recommend [Memory Optimized VMs](../../sizes-memory.md) for these workloads. To optimize your workloads further, we recommend [Constrained Core vCPUs](../../constrained-vcpu.md) for Oracle Database workloads that require high memory, storage, and I/O bandwidth, but not a high core count.

When you migrate Oracle software and workloads from on-premises to Microsoft Azure, Oracle provides license mobility as stated in [Oracle and Microsoft Strategic Partnership FAQ](https://www.oracle.com/cloud/technologies/oracle-azure-faq.html).

## High availability and disaster recovery considerations

When using Oracle databases in Azure, you're responsible for implementing a high availability and disaster recovery solution to avoid any downtime.

You can implement high availability and disaster recovery for Oracle Database Enterprise Edition by using [Data Guard, Active Data Guard](https://www.oracle.com/database/technologies/high-availability/dataguard.html), or [Oracle GoldenGate](https://www.oracle.com/technetwork/middleware/goldengate). The approach requires two databases on two separate VMs, which should be in the same [virtual network](../../../virtual-network/index.yml) to ensure they can access each other over the private persistent IP address.

We recommend placing the VMs in the same availability set to allow Azure to place them into separate fault domains and upgrade domains. If you want to have geo-redundancy, set up the two databases to replicate between two different regions and connect the two instances with a VPN Gateway. To walk through the basic setup procedure on Azure, see [Implement Oracle Data Guard on an Azure Linux virtual machine](configure-oracle-dataguard.md).

With Oracle Data Guard, you can achieve high availability with a primary database in one VM, a secondary (standby) database in another VM, and one-way replication set up between them. The result is read access to the copy of the database. With Oracle GoldenGate, you can configure bi-directional replication between the two databases. To learn how to set up a high-availability solution for your databases using these tools, see [Active Data Guard](https://www.oracle.com/database/technologies/high-availability/dataguard.html) and [GoldenGate](https://docs.oracle.com/goldengate/1212/gg-winux/index.html). If you need read-write access to the copy of the database, you can use [Oracle Active Data Guard](https://www.oracle.com/uk/products/database/options/active-data-guard/overview/index.html).

To walk through the basic setup procedure on Azure, see [Implement Oracle Golden Gate on an Azure Linux VM](configure-oracle-golden-gate.md).

In addition to having a high availability and disaster recovery solution architected in Azure, you should have a backup strategy in place to restore your database. To walk through the basic procedure for establishing a consistent backup, see [Overview of Oracle Applications and solutions on Azure](./oracle-overview.md).

## Support for JD Edwards

According to Oracle Support, JD Edwards EnterpriseOne versions 9.2 and above are supported on *any public cloud offering* that meets their specific Minimum Technical Requirements (MTR). You need to create custom images that meet their MTR specifications for operating system and software application compatibility. For more information, see [Doc ID 2178595.1](https://support.oracle.com/knowledge/JD%20Edwards%20EnterpriseOne/2178595_1.html).

## Oracle WebLogic Server VM offers

Oracle and Microsoft are collaborating to bring WebLogic Server to the Azure Marketplace in the form of Azure Application offers. For more information about these offers, see [What are solutions for running Oracle WebLogic Server](oracle-weblogic.md).

### Oracle WebLogic Server VM images

- **Clustering is supported on Enterprise Edition only.** You're licensed to use WebLogic clustering only when you use the Enterprise Edition of Oracle WebLogic Server. Don't use clustering with Oracle WebLogic Server Standard Edition.
- **UDP multicast is not supported.** Azure supports UDP unicasting, but not multicasting or broadcasting. Oracle WebLogic Server is able to rely on Azure UDP unicast capabilities. For best results relying on UDP unicast, we recommend that the WebLogic cluster size is kept static, or kept with no more than 10 managed servers.
- **Oracle WebLogic Server expects public and private ports to be the same for T3 access, for example, when using Enterprise JavaBeans.** Consider a multi-tier scenario where a service layer (EJB) application is running on an Oracle WebLogic Server cluster consisting of two or more VMs, in a virtual network named *SLWLS*. The client tier is in a different subnet in the same virtual network, running a simple Java program trying to call EJB in the service layer. Because you must load balance the service layer, a public load-balanced endpoint needs to be created for the VMs in the Oracle WebLogic Server cluster. If the private port that you specify is different from the public port, for example, 7006:7008, an error such as the following occurs:

  ```output
  [java] javax.naming.CommunicationException [Root exception is java.net.ConnectException: t3://example.cloudapp.net:7006:

  Bootstrap to: example.cloudapp.net/138.91.142.178:7006' over: 't3' got an error or timed out]
  ```

  This error occurs because for any remote T3 access, Oracle WebLogic Server expects the load balancer port and the WebLogic managed server port to be the same. In the preceding case, the client is accessing port 7006, which is the load balancer port, and the managed server is listening on 7008, which is the private port. This restriction is applicable only for T3 access, not HTTP.

  To avoid this issue, use one of the following workarounds:

  - Use the same private and public port numbers for load balanced endpoints dedicated to T3 access.
  - Include the following JVM parameter when starting Oracle WebLogic Server:

  ```config
  -Dweblogic.rjvm.enableprotocolswitch=true
  ```

- **Dynamic clustering and load balancing limitations.** Suppose you want to use a dynamic cluster in Oracle WebLogic Server and expose it through a single, public load-balanced endpoint in Azure. This approach can be done as long as you use a fixed port number for each of the managed servers, not dynamically assigned from a range, and don't start more managed servers than there are machines the administrator is tracking. That is, there's no more than one managed server per VM.

  If your configuration results in more Oracle WebLogic Servers being started than there are VMs, it isn't possible for more than one of those instances of Oracle WebLogic Servers to bind to a given port number. That is, if multiple Oracle WebLogic Server instances share the same virtual machine, the others on that VM fail.

  If you configure the admin server to automatically assign unique port numbers to its managed servers, then load balancing isn't possible because Azure doesn't support mapping from a single public port to multiple private ports, as would be required for this configuration.

- **Multiple instances of Oracle WebLogic Server on a VM.** Depending on your deployment requirements, you might consider running multiple instances of Oracle WebLogic Server on the same VM, if the VM is large enough. For example, on a midsize VM, which contains two cores, you could choose to run two instances of Oracle WebLogic Server. However, we still recommend that you avoid introducing single points of failure into your architecture. Running multiple instances of Oracle WebLogic Server on just one VM would be such a single point.

  Using at least two VMs could be a better approach. Each VM can run multiple instances of Oracle WebLogic Server. Each instance of Oracle WebLogic Server could still be part of the same cluster. However, it's currently not possible to use Azure to load-balance endpoints that are exposed by such Oracle WebLogic Server deployments within the same VM. Azure Load Balancer requires the load-balanced servers to be distributed among unique VMs.

## Next steps

You now have an overview of current Oracle solutions based on VM images in Microsoft Azure. Your next step is to deploy your first Oracle database on Azure.

> [!div class="nextstepaction"]
> [Create an Oracle database on Azure](oracle-database-quick-create.md)
