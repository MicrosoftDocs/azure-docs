## About records

Each DNS record has a name and a type. Records come in various types according to the data they contain. The most common type is an "A" record, which maps a name to an IPv4 address. Another type is an "MX" record, which maps a name to a mail server.

Azure DNS supports all common DNS record types: A, AAAA, CNAME, MX, NS, SOA, SRV and TXT. Record sets of type SOA are created automatically with each zone. They cannot be created separately. Note that SPF records should be created using the TXT record type. See [this page](http://tools.ietf.org/html/rfc7208#section-3.1) for more information.

In Azure DNS, records are specified by using relative names. A "fully qualified" domain name (FQDN) includes the zone name, whereas a "relative" name does not. For example, the relative record name "www" in the zone "contoso.com" gives the fully qualified record name "www.contoso.com".

## About record sets

Sometimes you need to create more than one DNS record with a given name and type. For example, suppose the www.contoso.com web site is hosted on two different IP addresses. This requires two different A records, one for each IP address. This is an example of a record set.

	www.contoso.com.		3600	IN	A	134.170.185.46
	www.contoso.com.		3600	IN	A	134.170.188.221

Azure DNS manages DNS records by using record sets. A record set is the collection of DNS records in a zone that have the same name and are the same type. Most record sets contain a single record, but examples like this one, in which a record set contains more than one record are not uncommon.

Records sets of type SOA and CNAME are an exception; the DNS standards do not permit multiple records with the same name for these types.

The Time-to-Live, or TTL, specifies how long each record is cached by clients before being re-queried. In this example, the TTL is 3600 seconds or 1 hour. The TTL is specified for the record set, not for each record, so the same value is used for all records within that record set.

#### Wildcard record sets

Azure DNS supports [wildcard records](https://en.wikipedia.org/wiki/Wildcard_DNS_record). These are returned for any query with a matching name (unless there is a closer match from a non-wildcard record set). Wildcard record sets are supported for all record types except NS and SOA.  

To create a wildcard record set, use the record set name "\*", or a name whose first label is "\*", e.g. "\*.foo".

#### CNAME record sets

CNAME record sets cannot co-exist with other record sets with the same name. For example, you cannot create a CNAME record set with the relative name "www" and an A record with the relative name "www" at the same time. Because the zone apex (name = ‘@’) always contains the NS and SOA record sets that were created when the zone was created, this means you cannot create a CNAME record set at the zone apex. These constraints arise from the DNS standards and aren't limitations of Azure DNS.
