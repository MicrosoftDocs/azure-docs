##TCP settings for Azure VMs

Azure VMs communicate with the public Internet by using [NAT][nat] (Network Address Translation). NAT devices assign a public IP address and port to an Azure VM, allowing that VM to establish a socket for communication with other devices. If packets stop flowing through that socket after a specific time, the NAT device kills the mapping, and the socket is free to be used by other VMs.

This is a common NAT behavior, which can cause communication issues on TCP based applications that expect a socket to be maintained beyond a time-out period. There are two idle timeout settings to consider, for sessions in a *established connection* state:

- **inbound** through the [Azure load balancer][azure-lb-timeout]. This timeout defaults to 4 minutes, and can be adjusted up to 30 minutes.
- **outbound** using [SNAT][snat] (Source NAT). This timeout is set to 4 minutes, and cannot be adjusted.

To ensure connections are not lost beyond the timeout limit, you should make sure either your application keeps the session alive, or you can configure the underlying operating system to do so. The settings to be used are different for Linux and Windows systems, as shown below.

For [Linux][linux], you should change the kernel variables below.
net.ipv4.tcp_keepalive_time = 120
net.ipv4.tcp_keepalive_intvl = 30
net.ipv4.tcp_keepalive_probes = 8
 
For [Windows][windows], you should change the registry values below.
KeepAliveInterval = 30
KeepAliveTime = 120
TcpMaxDataRetransmissions = 8


The settings above ensure a keep alive packet is sent after 2 minutes (120 seconds) of idle time, and then sent every 30 seconds. And if 8 of those packets fail, the session is dropped.

<!-- links -->
[nat]: http://computer.howstuffworks.com/nat.htm
[snat]: ../load-balancer/load-balancer-overview.md/#source-nat
[linux]: http://tldp.org/HOWTO/TCP-Keepalive-HOWTO/usingkeepalive.html
[windows]: http://blogs.technet.com/b/nettracer/archive/2010/06/03/things-that-you-may-want-to-know-about-tcp-keepalives.aspx
[azure-lb-timeout]: ../load-balancer/load-balancer-tcp-idle-timeout.md