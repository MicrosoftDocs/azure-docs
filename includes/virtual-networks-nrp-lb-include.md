## Load Balancer
A load balancer is used when you want to scale your applications. Typical deployment scenarios involve applications running on multiple VM instances. The VM instances are fronted by a load balancer that helps to distribute network traffic to the various instances. 

![NIC's on a single VM](./media/resource-groups-networking/Figure5.png)

Load balancers contain the following child resources:

- **Front end IP configuration** – a Load balancer can include one or more front end IP addresses, otherwise known as a virtual IPs (VIPs). These IP addresses serve as ingress for the traffic. 
- **Backend address pool** – these are IP addresses associated with the VM NICs to which load will be distributed.
- **Load balancing rules** – a rule property maps a given front end IP and port combination to a set of back end IP addresses and port combination. With a single definition of a load balancer resource, you can define multiple load balancing rules, each rule reflecting a combination of a front end IP and port and back end IP and port associated with VMs. 
- **Probes** – probes enable you to keep track of the health of VM instances. If a health probe fails, the VM instance will be taken out of rotation automatically.
- **Inbound NAT rules** – NAT rules defining the inbound traffic flowing through the front end IP and distributed to the back end IP.