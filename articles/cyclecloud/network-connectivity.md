# Network Connectivity

Azure CycleCloud supports [Virtual Networks](https://docs.microsoft.com/en-ca/azure/virtual-network/), [Virtual Private Clouds](https://aws.amazon.com/documentation/vpc/), and [Virtual Machines](https://cloud.google.com/compute/docs/instances/). When it is not possible to connect to these instances directly due to your network security configuration, there are several ways to connect to your cluster:

* VPN connection
* Bastion Server
* Proxy Node

## VPN

This is the simplest method and recommended when running in a production scenario in your own network. Instances inside the virtual network are directly reachable by your machine.

To create a connection between Azure and your VPN, please refer to the [Site-to-Site Connection](https://docs.microsoft.com/en-us/azure/vpn-gateway/vpn-gateway-howto-site-to-site-resource-manager-portal) documentation (or the appropriate documentation for your cloud provider).

## Bastion Server

Outside of connecting your corporate network directly to your virtual setup, the next best
option is to create an external-facing server (also called a bastion server or jump box) with a publicly accessible, static IP address. Azure provides several different scenarios in their [Network Security Best Practices](https://docs.microsoft.com/en-us/azure/security/azure-security-network-security-best-practices) documentation - choose the one that works best for your particular environment.

## Proxy Node

Instead of using a dedicated bastion server, you can configure one of the nodes
in your cluster to act as a proxy for communicating back to CycleCloud. For this to work, you will need to
configure the public subnet to automatically assign public IP addresses:

    [cluster htcondor]
      [[node proxy]]
      # this attribute configures the instance to act as a proxy
      IsReturnProxy = true
      credentials = cloud
      MachineType = t2.micro
      # this is the public subnet
      subnetid = subnet-1234557
      ImageName = cycle.image.centos7

      [[node private]]
      # this is the private subnet
      subnetid = subnet-1234557


Please note that `proxy` node in this cluster template only proxies
communication from instances to CycleCloud. It does not proxy communication to
the larger Internet.

You can use SSH tunneling to access the private node in this example via the proxy node.

After providing connectivity to your cluster, your cluster must still access the internet. Configure the network security group(s) within your cloud provider to allow access. The bastion server should belong to both the 'public' and 'private' security groups.

## Connection Commands

You can use either `cyclecloud connect` or raw SSH client commands to access
private servers within your virtual setup. These instructions assume you are using SSH, with public-key
authentication. This is typical for Linux instances. For Windows, you
can use this method to set up an RDP tunnel.

First, make the private key accessible to the target instance. The
simplest way is to run an SSH agent. This is run on your personal
machine, the one which has your private key.

> [!WARNING]
> The private key should never leave your personal machine! In the following examples your private key never leaves your machine. The agent uses this to respond to authentication challenges sent by the remote instance.

From your local machine, start the agent with the `ssh-agent` command:

    exec ssh-agent bash

If the private key is not your default private key (~/.ssh/id_rsa or
~/.ssh/identity), add it to the agent:

    ssh-add PATH_TO_KEYPAIR

Those commands only need to be run once (or after you reboot).

### Using `cyclecloud connect`

You can connect to an instance via a bastion server by specifying the IP address on the command line:

    $ cyclecloud connect htcondor-master --bastion-host 1.1.1.1

The above command assumes `cyclecloud` as the username, 22 as the port, and loads your
default SSH key. To customize these values, see the `--bastion-*` help options for the
`cyclecloud` command.

Alternately, the `cyclecloud` can detect the bastion host for you if you add the following
directive to your `~/.cycle/config.ini`:

    [cyclecloud]
    bastion_auto_detect = true

With the above directive, you can run `cyclecloud connect htcondor-master` without
specifying any details about the bastion server.

You can also use `cyclecloud connect` to connect a Windows instance. Executing the following
command will create an RDP connection over an SSH tunnel. Additionally, it will launch the
Microsoft RDP client on OS X and Windows:

    $ cyclecloud connect windows-execute-1

> [!NOTE]
> CycleCloud chooses an unused ephemeral port for the tunnel to the Windows instance.

Additionally, you configure the `cyclecloud` command to use a single bastion host for all your connections:

    [cyclecloud]
    bastion_host = 1.1.1.1
    bastion_user = example_user
    bastion_key = ~/.ssh/example_key.pem
    bastion_port = 222

### Using Raw SSH Commands

You can connect to an internal server via the bastion server using agent forwarding:

    ssh -A -t ec2-user@BASTION_SERVER_IP ssh -A root@TARGET_SERVER_IP

This connects to the bastion and then immediately runs ssh again, so
you get a terminal on the target instance. The default NAT ami uses
ec2-user. You may need to specify a user other than root on the target
instance if your cluster is configured differently. The -A argument
forwards the agent connection so your private key on your local
machine is used automatically. Note that agent forwarding is a chain, so the second ssh
command also includes -A so that any subsequent SSH connections
initiated from the target instance also use your local private key.

### Connecting to Services on the Target Instance

You can use the SSH connection to connect to services on the target
instance, such as a Remote Desktop, a database, etc. For example, if
the target instance is Windows, you can create a Remote Desktop tunnel
by connecting to the target instance with a similar SSH command from
above, using the -L argument:

    ssh -A -t ec2-user@BASTION_SERVER_IP  -L 33890:TARGET:3389 ssh -A root@TARGET_SERVER_IP

This will tunnel port 3389 on target to 33890 on your local
machine. Then if you connect to `localhost:33890` you will actually
be connected to the target instance.
