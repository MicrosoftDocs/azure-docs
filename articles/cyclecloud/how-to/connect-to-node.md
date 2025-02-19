---
title: Connecting to a Cluster Node
description: Use the CycleCloud web interface or CycleCloud CLI to log into a cluster node
author: adriankjohnson
ms.date: 03/25/2020
ms.author: jechia
---

# Connecting into Cluster Nodes

You can remotely access a cluster node using SSH for Linux nodes, and RDP for Windows nodes. 

::: moniker range="=cyclecloud-7"
The **Connect** button in the cluster management pane provides a connection string for accessing the node.  For example, to access a cluster head node, select the master node in the cluster management pane and click the **Connect** button:

![CycleCloud Master Node Connect Button](../images/version-7/cluster-connect-button.png)

The pop-up window shows the connection string you would use to connect to the cluster:

![CycleCloud Master Node Connection Screen](../images/version-7/connect-to-master-node.png)

Copy the appropriate connectionstring and use either your SSH client or the CycleCloud CLI to connect to the master node. 
::: moniker-end

::: moniker range=">=cyclecloud-8"
The **Connect** button in the cluster management pane provides a connection string for accessing the node.  For example, to access a cluster head node, select the scheduler node in the cluster management pane and click the **Connect** button:

![CycleCloud Master Node Connect Button](../images/version-8/cluster-connect-button.png)

The pop-up window shows the connection string you would use to connect to the cluster:

![CycleCloud Master Node Connection Screen](../images/version-8/connect-to-scheduler-node.png)

Copy the appropriate connectionstring and use either your SSH client or the CycleCloud CLI to connect to the master node. 
::: moniker-end


## Accessing cluster nodes in a private subnet

You can use either `cyclecloud connect` or raw SSH client commands to access nodes that are within a private subnet of your VNET. These instructions assume you are using SSH with public-key authentication. This is typical for Linux nodes. For Windows, you can use this method to set up an RDP tunnel.

First, make the private key accessible to the target node. The simplest way is to run an SSH agent on your personal machine.

> [!WARNING] 
> The private key should never leave your personal machine! In the
> following examples your private key never leaves your machine. The agent uses
> this to respond to authentication challenges sent by the remote node.

From your local machine, start the agent with the `ssh-agent` command:

``` script
exec ssh-agent bash
```

If the private key is not your default private key (*~/.ssh/id_rsa* or _~/.ssh/identity_), add it to the agent:

``` script
ssh-add PATH_TO_KEYPAIR
```

Those commands only need to be run once (or after you reboot).

### Using `cyclecloud connect`

You can connect to an node via a bastion server by specifying the IP address on the command line:

``` CLI
cyclecloud connect htcondor-scheduler --bastion-host 1.1.1.1
```

The above command assumes `cyclecloud` as the username, `22` as the port, and loads your default SSH key. To customize these values, see the `--bastion-*` help options for the [`cyclecloud` CLI command](~/cli.md#cyclecloud-connect).

Alternately, the CycleCloud CLI can detect the bastion host for you if you add the following directive to your `~/.cycle/config.ini`:

``` ini
[cyclecloud]
bastion_auto_detect = true
```

With the above directive, you can run `cyclecloud connect htcondor-scheduler` without specifying any details about the bastion server.

You can also use `cyclecloud connect` to connect a Windows VM. Executing the following command will create an RDP connection over an SSH tunnel. Additionally, it will launch the Microsoft RDP client on OSX and Windows:

``` CLI
cyclecloud connect windows-execute-1
```

> [!NOTE] 
> CycleCloud chooses an unused ephemeral port for the tunnel to the Windows VM.

You can configure the `cyclecloud` command to use a single bastion host for all your connections:

``` ini
[cyclecloud]
bastion_host = 1.1.1.1
bastion_user = example_user
bastion_key = ~/.ssh/example_key.pem
bastion_port = 222
```

### Using Raw SSH Commands

You can connect to a private server via the bastion server using agent forwarding:

``` CLI
ssh -A -t cyclecloud@BASTION_SERVER_IP ssh -A cyclecloud@TARGET_SERVER_IP
```

This connects to the bastion and then immediately runs SSH again, so you get a terminal on the target VM. You may need to specify a user other than
`cyclecloud` on the VM if your cluster is configured differently. The `-A` argument forwards the agent connection so your private key on your local machine is used automatically. Note that agent forwarding is a chain, so the second SSH command also includes `-A` so that any subsequent SSH connections initiated from the target VM also use your local private key.

### Connecting to Services on the Target VM

You can use the SSH connection to connect to services on the target VM, such as a Remote Desktop, a database, etc. For example, if the target VM is Windows, you can create a Remote Desktop tunnel by connecting to the target VM with a similar SSH command from above, using the `-L` argument:


``` CLI
ssh -A -t cyclecloud@BASTION_SERVER_IP  -L 33890:TARGET:3389 ssh -A cyclecloud@TARGET_SERVER_IP
```

This will tunnel port 3389 on target to 33890 on your local machine. Then if you connect to `localhost:33890` you will actually be connected to the target VM.

