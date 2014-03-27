The Domain Name System (DNS) is used to locate things on the internet. For example, when you enter an address in your browser, or click a link on a web page, it uses DNS to translate the domain into an IP address. The IP address is sort of like a street address, but it's not very human friendly. For example, it is much easier to remember a DNS name like **contoso.com** than it is to remember an IP address such as 192.168.1.88 or 2001:0:4137:1f67:24a2:3888:9cce:fea3.

The DNS system is based on *records*. Records associate a specific *name*, such as **contoso.com**, with either an IP address or another DNS name. When an application, such as a web browser, looks up a name in DNS, it finds the record, and uses whatever it points to as the address. If the value it points to is an IP address, the browser will use that value. If it points to another DNS name, then the application has to do resolution again. Ultimately, all name resolution will end in an IP address.

When you create an Azure Web Site, a DNS name is automatically assigned to the site. This name takes the form of **&lt;yoursitename&gt;.azurewebsites.net**. There is also an virtual IP address available for use when creating DNS records, so you can either create records that point to the **.azurewebsites.net**, or you can point to the IP address.

> [WACOM.NOTE] The IP address of your web site will change if you delete and recreate your web site, or change the web site mode to free after it has been set to basic, shared, or standard.

There are also multiple types of records, each with their own functions and limitations, but for web sites we only care about two, *CNAME* and *A* records.

###CNAME or Alias record

A CNAME record maps a *specific* DNS name, such as **mail.contoso.com** or **www.contoso.com**, to another (canonical) domain name. In the case of Azure Web Sites, the canonical domain name is the **&lt;myapp>.azurewebsites.net** domain name of your web site. Once created, the CNAME creates an alias for the **&lt;myapp>.azurewebsites.net** domain name. The CNAME entry will resolve to the IP address of your **&lt;myapp>.azurewebsites.net** domain name automatically, so if the IP address of the web site changes, you do not have to take any action.

> [WACOM.NOTE] Some domain registrars only allow you to map subdomains when using a CNAME record, such as **www.contoso.com**, and not root names, such as **contoso.com**. For more information on CNAME records, see the documentation provided by your registrar, <a href="http://en.wikipedia.org/wiki/CNAME_record">the Wikipedia entry on CNAME record</a>, or the <a href="http://tools.ietf.org/html/rfc1035">IETF Domain Names - Implementation and Specification</a> document.

###A record

An A record maps a domain, such as **contoso.com** or **www.contoso.com**, *or a wildcard domain* such as **\*.contoso.com**, to an IP address. In the case of an Azure Web Site, either the virtual IP of the service or a specific IP address that you purchased for your web site.

The main benefits of an A record over a CNAME record are:

* You can map a root domain such as **contoso.com** to an IP address; many registrars only allow this using A records

* You can have one entry that uses a wildcard, such as **\*.contoso.com**, which would handle requests for multiple sub-domains such as **mail.contoso.com**, **login.contoso.com**, or **www.contso.com**.

> [WACOM.NOTE] Since an A record is mapped to a static IP address, it cannot automatically resolve changes to the IP address of your web site. An IP address for use with A records is provided when you configure custom domain name settings for your web site; however, this value may change if you delete and recreate your web site, or change the web site mode to back to free.

###Azure Web Site DNS specifics

Using an A record with Azure Web Sites requires you to first create an CNAME record that maps either:

* A DNS name of **www** to your **&lt;yourwebsitename&gt;.azurewebsites.net**.
OR
* A DNS name of **awverify.www** to **awverify.&lt;yourwebsitename&gt;.azurewebsites.net**.

This CNAME record is used to verify that you own the domain you are attempting to use. This is in addition to creating an A record pointing to the virtual IP address of your web site.

You can find the IP address, as well as the **awverify.www** name and **.azurewebsites.net** names for your web site by performing the following steps:

1. In your browser, open the [Azure Management Portal](https://manage.windowsazure.com).

2. In the **Web Sites** tab, click the name of your site, select **Dashboard**, and then select **Manage Domains** from the bottom of the page.

	![](./media/custom-dns-web-site/dncmntask-cname-6.png)

6. In the **MANAGE CUSTOM DOMAINS** dialog, you will see the **awverify** information, the currently assigned **.azurewebsites.net** domain name, and the virtual IP address.

