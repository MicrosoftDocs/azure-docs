The Domain Name System (DNS) is used to locate things on the internet. For example, when you enter an address in your browser, or click a link on a web page, it uses DNS to translate the domain into an IP address. The IP address is sort of like a street address, but it's not very human friendly. For example, it is much easier to remember a DNS name like **contoso.com** than it is to remember an IP address such as 192.168.1.88 or 2001:0:4137:1f67:24a2:3888:9cce:fea3.

The DNS system is based on *records*. Records associate a specific *name*, such as **contoso.com**, with either an IP address or another DNS name. When an application, such as a web browser, looks up a name in DNS, it finds the record, and uses whatever it points to as the address. If the value it points to is an IP address, the browser will use that value. If it points to another DNS name, then the application has to do resolution again. Ultimately, all name resolution will end in an IP address.

When you create an Azure Website, a DNS name is automatically assigned to the site. This name takes the form of **&lt;yoursitename&gt;.azurewebsites.net**. When you add your website as an Azure Traffic Manager endpoint, your website is then accessible through the **&lt;yourtrafficmanagerprofile&gt;.trafficmanager.net** domain.

> [AZURE.NOTE] When your website is configured as a Traffic Manager endpoint, you will use the **.trafficmanager.net** address when creating DNS records.

> You can only use CNAME records with Traffic Manager

There are also multiple types of records, each with their own functions and limitations, but for websites configured to as Traffic Manager endpoints, we only care about one; *CNAME* records.

###CNAME or Alias record

A CNAME record maps a *specific* DNS name, such as **mail.contoso.com** or **www.contoso.com**, to another (canonical) domain name. In the case of Azure Websites using Traffic Manager, the canonical domain name is the **&lt;myapp>.trafficmanager.net** domain name of your Traffic Manager profile. Once created, the CNAME creates an alias for the **&lt;myapp>.trafficmanager.net** domain name. The CNAME entry will resolve to the IP address of your **&lt;myapp>.trafficmanager.net** domain name automatically, so if the IP address of the website changes, you do not have to take any action.

Once traffic arrives at Traffic Manager, it then routes the traffic to your website, using the load balancing method it is configured for. This is completely transparent to visitors to your website. They will only see the custom domain name in their browser.

> [AZURE.NOTE] Some domain registrars only allow you to map subdomains when using a CNAME record, such as **www.contoso.com**, and not root names, such as **contoso.com**. For more information on CNAME records, see the documentation provided by your registrar, <a href="http://en.wikipedia.org/wiki/CNAME_record">the Wikipedia entry on CNAME record</a>, or the <a href="http://tools.ietf.org/html/rfc1035">IETF Domain Names - Implementation and Specification</a> document.
