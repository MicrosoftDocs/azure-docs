## Network Security Group (NSG)
An NSG resource enables the creation of security boundary for workloads, by implementing allow and deny rules. Such rules can be applied at the NIC level (VM instance level) or at the subnet level (group of VMs).

Key properties of NSG resource include:

- **Security rule** - An NSG can have multiple security rules defined. Each rule can allow or deny different types of traffic.

### Security Rule
A security rule is a child resource of an NSG. 

Key properties of a Security rule include: 

- **Protocol** – network protocol this rule applies to.
- **Source Port Range** - source port, or range from, 0 to 65535.  A wildcard can be used to match all ports. 
- **Destination Port Range** - Destination port, or range, from 0 to 65535.  A wildcard can be used to match all ports.
- **Source Address Prefix** – source IP address range. 
- **Destination Address Prefix** – destination IP address range.
- **Access** – *Allow* or *Deny* traffic.
- **Priority** – a value between 100 and 4096. The priority number must be unique for each rule in collection of security rules. The lower the priority number, the higher the priority of the rule.
- **Direction** – specifies if the rule will be applied to traffic in the *Inbound* or *Outbound* direction. 