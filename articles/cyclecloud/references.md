# References (Environments)

References are an orchestrated type used to create dependencies between different resources, and allow those resources to expose properties through dereference plugins.
​
The functionality is called ‘references’. References (Cloud.Reference) are a new orchestrated type that is used to create dependencies between different resources and allow different resources to expose properties through dereference plugins.​

The lifecycle of a reference is to​
1) Dereference itself and see if what it is referring to has reached its final ‘readystate’ – Started for clusters and environments and Ready for nodes.​
2) Once the referred to resource is ready, the plugin for dereferencing the resource is used to extract a record of relevant properties and is saved as an implicitly defined cluster parameter (Cloud.ClusterParameter)​

[environmentref envy]​
SourceClusterName = external​
​
This creates a Cloud.ClusterParameter and a Cloud.Reference named envy. The Cloud.Reference points to a Cloud.Environment record using the keys ClusterName=external and Name=envy. ​
​
So when we type​
${envy.outputs.whatever}​
we are using a plain-old cluster parameter that is being updated on-the-fly by the orchestrated reference. The environment itself actually knows nothing about what is happening downstream.​
​
​
​Simply using a reference (${nameofref}) creates a dependency on that resource. This means that, currently, the resource won’t begin allocation until all of its dependencies reach the ReadyState. It also means that any resource that is currently being referred to can’t be terminated / deleted until its dependents reach the same state.​
​
Environments, clusters, nodes and nodearrays can depend on environments, clusters and nodes. There is no restriction that an environment can’t depend on a node, for example.​
​
(Note – nodearrays can use references but can’t be referred to directly.)​

[[node n]]​
SubnetId = ${env.outputs.SubnetId}​
   [[[configuration]]]​
   other.ipaddress = ${othernode.instance.PrivateIP}​
​
Simply using ${othernode} means that node n won’t start until the othernode does.

[noderef master]​
Name = something-else​
# default is the title, in this case master.​
SourceClusterName = external​
​
To create a reference within your own template, use simply​
[noderef master]​
# source cluster is assumed to be in the template​

[clusterref] is a bit special. Unlike environmentref and noderef, it can actually be used at parse time to pull in the current parameter values of another existing cluster. So​
​
[clusterref external]​
…​
   [[node n]]​
   Region = ${external.parameters.region}​
