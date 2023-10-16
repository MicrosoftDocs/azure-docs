---
ms.service: defender-for-cloud
ms.custom: ignite-2022
ms.topic: include
ms.date: 07/25/2023
ms.author: dacurwin
author: dcurwin
---

| Aspect | Details |
|--|--|
| Registries and images | **Supported**<br> • ACR registries <br> • [ACR registries protected with Azure Private Link](/azure/container-registry/container-registry-private-link) (Private registries requires access to Trusted Services) <br> • Container images in Docker V2 format <br>  **Unsupported**<br>   • Super-minimalist images such as [Docker scratch](https://hub.docker.com/_/scratch/) images<br> • "Distroless" images that only contain an application and its runtime dependencies without a package manager, shell, or OS<br> is currently unsupported <br> • Images with [Open Container Initiative (OCI)](https://github.com/opencontainers/image-spec/blob/main/spec.md) image format specification <br> • Windows images<br>|
| OS Packages | **Supported** <br> • Alpine Linux 3.12-3.16 <br> • Red Hat Enterprise Linux 6-9 <br> • CentOS 6-9<br> • Oracle Linux 6-9 <br> • Amazon Linux 1, 2 <br> • openSUSE Leap, openSUSE Tumbleweed <br> • SUSE Enterprise Linux 11-15 <br> • Debian GNU/Linux 7-12 <br> • Ubuntu 12.04-22.04 <br>  • Fedora 31-37<br> • Mariner 1-2|
| Language specific packages <br><br>  | **Supported** <br> • Python <br> • Node.js <br> • .NET <br> • JAVA <br> • Go |
