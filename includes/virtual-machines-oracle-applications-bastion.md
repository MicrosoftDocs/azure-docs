---
author: dlepow
ms.service: virtual-machines
ms.topic: include
ms.date: 07/10/2019
ms.author: danlep
---
### Bastion tier

The bastion host is an optional component that you can use as a jump server to access the application and database instances. The bastion host VM can have a public IP address assigned to it, although the recommendation is to set up an ExpressRoute connection or site-to-site VPN with your on-premises network for secure access. Additionally, only SSH (port 22, Linux) or RDP (port 3389, Windows Server) should be opened for incoming traffic. For high availability, deploy a bastion host in two availability zones or in a single availability set.

You may also enable SSH agent forwarding on your VMs, which allows you to access other VMs in the virtual network by forwarding the credentials from your bastion host. Or, use SSH tunneling to access other instances.

Here's an example of agent forwarding:

```
ssh -A -t user@BASTION_SERVER_IP ssh -A root@TARGET_SERVER_IP`
```

This command connects to the bastion and then immediately runs `ssh` again, so you get a terminal on the target instance. You may need to specify a user other than root on the target instance if your cluster is configured differently. The `-A` argument forwards the agent connection so your private key on your local machine is used automatically. Note that agent forwarding is a chain, so the second `ssh` command also includes `-A` so that any subsequent SSH connections initiated from the target instance also use your local private key.