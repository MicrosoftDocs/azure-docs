---
title: Configure firewalls in Red Hat VMs: Azure Modeling and Simulation Workbench
description: Configure firewalls in Red Hat VMs
author: yousefi-msft
ms.author: yousefi
ms.service: modeling-and-simulation-workbench
ms.topic: how-to
ms.date: 08/18/2024

#CustomerIntent: As a Chamber Admin, I want to configure firewalls on individual VMs to allow applications to communicate within a Chamber.
---

Chamber VMs run Red Hat Linux as the operating system. By default, these images have a firewall configured to that deny any connections being made to the host, regardless if a service has been started. To allow communication on the necessary ports, the firewall must be configured to allow traffic to pass through. Similarly, if a rule is no longer required, it should be removed.

This article will present the most common firewall configuration commands. For full documentation or more complex scenarios, see [Chapter 40. Using and configuring firewalld](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/8/html/configuring_and_managing_networking/using-and-configuring-firewalld_configuring-and-managing-networking) of the Red Hat Enterprise Linux 8 documentation.

All the operations referenced here require `sudo` privileges and thus need the Chamber Admin role.

> [!IMPORTANT]
> Modifying firewall rules only allows the individual VM to communicate with other VMs in the same Chamber. Chamber-to-Chamber traffic is never permitted.

## Prerequisites

* A user account with the Chamber Admin role assigned for `sudo` privileges.

## List all open ports

List all currently open ports. This command will list ports and associated protocol.

```bash
$ sudo firewall-cmd --list-all
```

## Open ports for traffic

You can open ports for network traffic, opening a single port or a range.  These permissions are in the runtime set and not permanent and will not persist a service or VM restart.

### Open a single port

Open a single port with `firewalld` for a given protocol using the `--add-port=portnumber/porttype` option. The following example opens port 5510 for TCP.

```bash
$ sudo firewall-cmd --add-port=33500/tcp
```

Commit the rule to the permanent set by executing the following:

```bash
$ sudo firewall-cmd --runtime-to-permanent
```

### Open a range of ports

Open a range of ports with `firewalld` for a specified protocol with the `--add-port=startport-endport/porttype` otpion. This command is often useful in distributed computing scenarios where workers are dispatched to a large number of nodes and multiple workers may be dispatched to the same physical node.  The following example opens 100 consecutive ports starting at port 5000 with the UDP protocol.

```bash
sudo firewall-cmd --add-port=5000-5099/udp
```

Commit the rule to the permanent set by executing the following:

```bash
$ sudo firewall-cmd --runtime-to-permanent
```

## Remove port rules

If rules are no longer needed, they can be removed with the same notation as adding and using the `--remove-port=portnumber/porttype`. The following example removes the single port example we used above.

```bash
$ sudo firewall-cmd --remove-port=33500/tcp
```

Commit the rule to the permanent set by executing the following:

```bash
$ sudo firewall-cmd --runtime-to-permanent
```

## Next step

TODO: Add your next step link(s)

> [!div class="nextstepaction"]
> [Write concepts](article-concept.md)

<!-- OR -->

## Related content

TODO: Add your next step link(s)
