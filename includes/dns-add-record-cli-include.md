#### Create an A record set with single record

To create a record set, use `azure network dns record-set create`. Specify the resource group, zone name, record set relative name, record type, and time to live (TTL).

	azure network dns record-set create myresourcegroup  contoso.com "test-a"  A --ttl 300

After creating the A record set, add the IPv4 address to the record set with `azure network dns record-set add-record`.

	azure network dns record-set add-record myresourcegroup contoso.com "test-a" A -a 192.168.1.1

#### Create an AAAA record set with a single record

	azure network dns record-set create myresourcegroup contoso.com "test-aaaa" AAAA --ttl 300

	azure network dns record-set add-record myresourcegroup contoso.com "test-aaaa" AAAA -b "2607:f8b0:4009:1803::1005"

#### Create a CNAME record set with a single record

CNAME records only allow one single string value.


	azure network dns record-set create -g myresourcegroup contoso.com  "test-cname" CNAME --ttl 300

	azure network dns record-set add-record  myresourcegroup contoso.com  test-cname CNAME -c "www.contoso.com"


#### Create an MX record set with a single record

In this example, we use the record set name "@" to create the MX record at the zone apex (in this case, "contoso.com"). This is common for MX records.

	azure network dns record-set create myresourcegroup contoso.com  "@"  MX --ttl 300

	azure network dns record-set add-record -g myresourcegroup contoso.com  "@" MX -e "mail.contoso.com" -f 5


#### Create an NS record set with a single record

	azure network dns record-set create myresourcegroup contoso.com test-ns  NS --ttl 300

	azure network dns record-set add-record myresourcegroup  contoso.com  "test-ns" NS -d "ns1.contoso.com"

#### Create an SRV record set with a single record

If you are creating an SRV record in the root of the zone, you can specify "_service" and "_protocol" in the record name. There is no need to include "@" in the record name.


	azure network dns record-set create myresourcegroup contoso.com "_sip._tls" SRV --ttl 300

	azure network dns record-set add-record myresourcegroup contoso.com  "_sip._tls" SRV -p 0 - w 5 -o 8080 -u "sip.contoso.com"

#### Create a TXT record set with single record

	azure network dns record-set create myresourcegroup contoso.com "test-TXT" TXT --ttl 300

	azure network dns record-set add-record myresourcegroup contoso.com "test-txt" TXT -x "this is a TXT record"
