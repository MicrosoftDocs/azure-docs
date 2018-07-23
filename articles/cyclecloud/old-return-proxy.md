# Return Proxy

Some features of Azure CycleCloud require cloud instances to access the tool's platform. If your instance lies behind a firewall, those features won't work without either forwarding various
ports through the firewall, using a VPN, or enabling a Return Proxy.

To enable a Return Proxy, the cluster nodes will need access to the Return Proxy
node on ports 37140-37141. This can be accomplished by adding a security
rule to allow access to those ports from within your cluster.

Next, declare a node as a Return Proxy by setting `IsReturnProxy` equal to `True`.

Finally, you need to define `KeyPair`, `KeyPairLocation`, and `Username` for the Return Proxy node.

The Return Proxy is assumed to be running within the same Cloud Provider network as the
cluster, so by default the private network address of the proxy is used for communication.
If you need to run your Return Proxy outside of the cluster network (in a different region
or on a separate Cloud Provider), you will need to tell the Return Proxy to use the public address
by setting ReturnProxyAddress to `public`. The default case is sufficient for the majority of configurations.

An example Return Proxy node might look like the following:

    [[node master]]
    IsReturnProxy = true  # access to CycleServer is proxied through this node
    ReturnProxyAddress = <public>  # use the public address of the proxy rather than the default private address

    Username = cyclecloud

    # Custom keypair
    KeyPair = custom-keypair
    KeyPairLocation = ~/.ssh/custom-keypair.pem

Only one node may be declared the Return Proxy of the cluster. If multiple nodes are defined,
the cluster will not start. This setting is currently only supported on CentOS, Ubuntu, and Suse nodes.
It is recommended that your Return Proxy be configured on your scheduler/master/head node.
