---
title: List of supported classifications
description: This page lists the supported system classifications in Azure Purview.
author: anmuk601
ms.author: anmuk
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: reference
ms.date: 02/05/2021
## Customer intent: As a data steward or catalog administrator, I need to understand what's supported under classifications.
---

# Supported classifications in Azure Purview

This article lists the supported and defined system classifications in Azure Purview (Preview).


- **Distinct match threshold**: The total number of distinct data values that need to be found in a column before the scanner runs the data pattern on it. Our system classification rules require there to be at least 8 distinct values in each column to subject them to classification. The system requires this value to make sure that the column contains enough data for the scanner to accurately classify it. For example, a column that contains multiple rows that all contain the value 1 won't be classified. Columns that contain one row with a value and the rest of the rows have null values also won't get classified. If you specify multiple patterns, this value applies to each of them.

- **Minimum match threshold**: It is the minimum percentage of data value matches in a column that must be found by the scanner for the classification to be applied. The system classification value is set at 60%.


## Defined system classifications

Azure Purview classifies data by [RegEx](https://wikipedia.org/wiki/Regular_expression) and [Bloom Filter](https://wikipedia.org/wiki/Bloom_filter). The following lists describe the format, pattern, and keywords for the Azure Purview defined system classifications.

Each classification name is prefixed by MICROSOFT.

## Bloom Filter Classifications

## City, Country, and Place

The City, Country, and Place filters have been prepared using best datasets available for preparing the data.

## Person

Person bloom filter has been prepared using the below two datasets.

- [2010 US Census Data for Last Names (162-K entries)](https://www.census.gov/topics/population/genealogy/data/2010_surnames.html)
- [Popular Baby Names (from SSN), using all years 1880-2019 (98-K entries)](https://www.ssa.gov/oact/babynames/limits.html)

## RegEx Classifications

## ABA Routing

### Format

Nine digits, which may be in a formatted or unformatted pattern

### Pattern

Formatted:

- four digits beginning with 0, 1, 2, 3, 6, 7, or 8
- a hyphen
- four digits
- a hyphen
- a digit

Unformatted: nine consecutive digits beginning with 0, 1, 2, 3, 6, 7, or 8

### Keywords

#### Keyword_aba_routing

```
amba number
aba #
aba
abarouting#
abaroutingnumber
americanbankassociationrouting#
americanbankassociationroutingnumber
bank routing#
bankroutingnumber
routing #
routing no
routing number
routing transit number
routing#
RTN
```

## Argentina national identity (DNI) number

### Format

Eight digits with or without periods

### Pattern

Eight digits:

- two digits
- an optional period
- three digits
- an optional period
- three digits

### Keywords

#### Keyword_argentina_national_id

```
Argentina National Identity number
cedula
cédula
dni
documento nacional de identidad
documento número
documento numero
registro nacional de las personas
rnp
```

## Australia bank account number

### Format

Six to 10 digits with or without a bank state branch number

### Pattern

Account number is six to 10 digits.

Australia bank state branch number:

- three digits
- a hyphen
- three digits

### Keywords

#### Keyword_australia_bank_account_number

```
swift bank code
correspondent bank
base currency
usa account
holder address
bank address
information account
fund transfers
bank charges
bank details
banking information
full names
iaea
```

## Australia driver's license number

### Format
Nine letters and digits

### Pattern
nine letters and digits:

- two digits or letters (not case sensitive)
- two digits
- five digits or letters (not case sensitive)

OR

- one to two optional letters (not case sensitive)
- four to nine digits

OR

- nine digits or letters (not case sensitive)

### Keywords

#### Keyword_australia_drivers_license_number

```
international driving permits
australian automobile association
international driving permit
DriverLicence
DriverLicences
Driver Lic
Driver License
Driver Licenses
DriversLic
DriversLicence
DriversLicences
Drivers Lic
Drivers Lics
Drivers License
Drivers Licenses
Driver'Lic
Driver'Lics
Driver'License
Driver'Licenses
Driver' Lic
Driver' Lics
Driver' License
Driver' Licenses
Driver'sLic
Driver'sLics
Driver'sLicence
Driver'sLicences
Driver's Lic
Driver's Lics
Driver's License
Driver's Licenses
DriverLic#
DriverLics#
DriverLicence#
DriverLicences#
Driver Lic#
Driver Lics#
Driver License#
Driver Licenses#
DriversLic#
DriversLics#
DriversLicence#
DriversLicences#
Drivers Lic#
Drivers Lics#
Drivers License#
Drivers Licenses#
Driver'Lic#
Driver'Lics#
Driver'License#
Driver'Licenses#
Driver' Lic#
Driver' Lics#
Driver' License#
Driver' Licenses#
Driver'sLic#
Driver'sLics#
Driver'sLicence#
Driver'sLicences#
Driver's Lic#
Driver's Lics#
Driver's License#
Driver's Licenses#
```

#### Keyword_australia_drivers_license_number_exclusions

```
aaa
DriverLicense
DriverLicenses
Driver License
Driver Licenses
DriversLicense
DriversLicenses
Drivers License
Drivers Licenses
Driver'License
Driver'Licenses
Driver' License
Driver' Licenses
Driver'sLicense
Driver'sLicenses
Driver's License
Driver's Licenses
DriverLicense#
DriverLicenses#
Driver License#
Driver Licenses#
DriversLicense#
DriversLicenses#
Drivers License#
Drivers Licenses#
Driver'License#
Driver'Licenses#
Driver' License#
Driver' Licenses#
Driver'sLicense#
Driver'sLicenses#
Driver's License#
Driver's Licenses#
```

## Australian medicare number

### Format

10-11 digits

### Pattern

10-11 digits:

- first digit is in the range 2-6
- ninth digit is a check digit
- tenth digit is the issue digit
- eleventh digit (optional) is the individual number

### Keywords

#### Keyword_Australia_Medicare_Number

```
bank account details
medicare payments
mortgage account
bank payments
information branch
credit card loan
department of human services
local service
medicare
```

## Australia passport number

### Format

A letter followed by seven digits

### Pattern

A letter (not case sensitive) followed by seven digits

### Keywords

#### Keyword\_passport

```
Passport Number
Passport No
Passport #
Passport#
PassportID
Passport no
passport number
パスポート
パスポート番号
パスポートのNum
パスポート＃
Numéro de passeport
Passeport n °
Passeport Non
Passeport #
Passeport#
PasseportNon
Passeportn °
```

#### Keyword\_australia\_passport\_number

```
passport
passport details
immigration and citizenship
commonwealth of australia
department of immigration
residential address
department of immigration and citizenship
visa
national identity card
passport number
travel document
issuing authority
```

## Australia tax file number

### Format

eight to nine digits

### Pattern

eight to nine digits typically presented with spaces as follows:

- three digits
- an optional space
- three digits
- an optional space
- two to three digits where the last digit is a check digit

### Keywords

#### Keyword\_australia\_tax\_file\_number

```
australian business number
marginal tax rate
medicare levy
portfolio number
service veterans
withholding tax
individual tax return
tax file number
tfn
```

## Belgium national number

### Format

11 digits plus optional delimiters

### Pattern

11 digits plus delimiters:

- six digits and two optional periods in the format YY.MM.DD for date of birth
- An optional delimiter from dot, dash, space
- three sequential digits (odd for males, even for females)
- An optional delimiter from dot, dash, space
- two check digits

### Keywords

#### Keyword\_belgium\_national\_number

```
be lasting aantal
bnn#
bnn
carte d'identité
identifiant national
identifiantnational#
identificatie
identification
identifikation
identifikationsnummer
identifizierung
identité
identiteit
identiteitskaart
identity
inscription
national number
national register
national number#
national number
nif#
nif
numéro d'assuré
numéro de registre national
numéro de sécurité
numéro d'identification
numéro d'immatriculation
numéro national
numéronational#
personal ID number
personalausweis
personalidnumber#
registratie
registration
registrationsnumme
registrierung
social security number
ssn#
ssn
steuernummer
tax ID
tax identification no
tax identification number
tax no#
tax no
tax number
tax registration number
tax ID#
tax ID no#
tax ID number#
tax no#
tax number#
tax number
tin ID
tin no
tin#
```

## Brazil CPF number

### Format

11 digits that include a check digit and can be formatted or unformatted

### Pattern

Formatted:

- three digits
- a period
- three digits
- a period
- three digits
- a hyphen
- two digits, which are check digits

Unformatted:

- 11 digits where the last two digits are check digits

### Keywords

#### Keyword\_brazil\_cpf

```
CPF
Identification
Registration
Revenue
Cadastro de Pessoas Físicas
Imposto
Identificação
Inscrição
Receita
```

## Brazil legal entity number (CNPJ)

### Format

14 digits that include a registration number, branch number, and check digits, plus delimiters

### Pattern

14 digits, plus delimiters:

- two digits
- a period
- three digits
- a period
- three digits (these first eight digits are the registration number)
- a forward slash
- four-digit branch number
- a hyphen
- two digits, which are check digits

### Keywords

#### Keyword\_brazil\_cnpj

```
CNPJ
CNPJ/MF
CNPJ-MF
National Registry of Legal Entities
Taxpayers Registry
Legal entity
Legal entities
Registration Status
Business
Company
CNPJ
Cadastro Nacional da Pessoa Jurídica
Cadastro Geral de Contribuintes
CGC
Pessoa jurídica
Pessoas jurídicas
Situação cadastral
Inscrição
Empresa
```

## Brazil national identification card (RG)

### Format

:::no-loc text="Registro Geral (old format): Nine digits":::

:::no-loc text="Registro de Identidade (RIC) (new format): 11 digits":::

### Pattern

:::no-loc text="Registro Geral (old format):":::

- two digits
- a period
- three digits
- a period
- three digits
- a hyphen
- one digit, which is a check digit

:::no-loc text="Registro de Identidade (RIC) (new format):":::

- 10 digits
- a hyphen
- one digit, which is a check digit

### Keywords

#### Keyword\_brazil\_rg

```
Cédula de identidade
identity card
national ID
número de rregistro
registro de Iidentidade
registro geral
RG (this keyword is case-sensitive)
RIC (this keyword is case-sensitive)
```

## Canada bank account number

### Format

7 or 12 digits

### Pattern

A Canada Bank Account Number is 7 or 12 digits.

A Canada bank account transit number is:

- five digits
- a hyphen
- three digits OR
- a zero &quot;0&quot;
- eight digits

### Keywords

#### Keyword\_canada\_bank\_account\_number

```
canada savings bonds
canada revenue agency
canadian financial institution
direct deposit form
canadian citizen
legal representative
notary public
commissioner for oaths
child care benefit
universal child care
canada child tax benefit
income tax benefit
harmonized sales tax
social insurance number
income tax refund
child tax benefit
territorial payments
institution number
deposit request
banking information
direct deposit
```

## Canada driver's license number

### Format

Varies by province

### Pattern

Various patterns covering Alberta, British Columbia, Manitoba, New Brunswick, Newfoundland/Labrador, Nova Scotia, Ontario, Prince Edward Island, Quebec, and Saskatchewan

### Keywords

#### Keyword\_[province\_name]\_drivers\_license\_name

- The province abbreviation, for example AB
- The province name, for example Alberta

#### Keyword\_canada\_drivers\_license

```
DL
DLS
CDL
CDLS
DriverLic
DriverLics
DriverLicense
DriverLicenses
DriverLicence
DriverLicences
Driver Lic
Driver Lics
Driver License
Driver Licenses
Driver License
Driver Licenses
DriversLic
DriversLics
DriversLicence
DriversLicences
DriversLicense
DriversLicenses
Drivers Lic
Drivers Lics
Drivers License
Drivers Licenses
Drivers License
Drivers Licenses
Driver'Lic
Driver'Lics
Driver'License
Driver'Licenses
Driver'License
Driver'Licenses
Driver' Lic
Driver' Lics
Driver' License
Driver' Licenses
Driver' License
Driver' Licenses
Driver'sLic
Driver'sLics
Driver'sLicense
Driver'sLicenses
Driver'sLicence
Driver'sLicences
Driver's Lic
Driver's Lics
Driver's License
Driver's Licenses
Driver's License
Driver's Licenses
Permis de Conduire
ID
IDs
ID card number
ID card numbers
ID card #
ID card #s
ID card
ID cards
ID card
identification number
identification numbers
identification #
identification #s
identification card
identification cards
identification
DL#
DLS#
CDL#
CDLS#
DriverLic#
DriverLics#
DriverLicense#
DriverLicenses#
DriverLicence#
DriverLicences#
Driver Lic#
Driver Lics#
Driver License#
Driver Licenses#
Driver License#
Driver Licenses#
DriversLic#
DriversLics#
DriversLicense#
DriversLicenses#
DriversLicence#
DriversLicences#
Drivers Lic#
Drivers Lics#
Drivers License#
Drivers Licenses#
Drivers License#
Drivers Licenses#
Driver'Lic#
Driver'Lics#
Driver'License#
Driver'Licenses#
Driver'License#
Driver'Licenses#
Driver' Lic#
Driver' Lics#
Driver' License#
Driver' Licenses#
Driver' License#
Driver' Licenses#
Driver'sLic#
Driver'sLics#
Driver'sLicense#
Driver'sLicenses#
Driver'sLicence#
Driver'sLicences#
Driver's Lic#
Driver's Lics#
Driver's License#
Driver's Licenses#
Driver's License#
Driver's Licenses#
Permis de Conduire#
ID#
IDs#
ID card#
ID cards#
ID card#
identification card#
identification cards#
identification#
```

## Canada health service number

### Format

10 digits

### Pattern

10 digits

### Keywords

#### Keyword\_canada\_health\_service\_number

```
personal health number
patient information
health services
specialty services
automobile accident
patient hospital
psychiatrist
workers compensation
disability
```

## Canada passport number

### Format

two uppercase letters followed by six digits

### Pattern

two uppercase letters followed by six digits

### Keywords

#### Keyword\_canada\_passport\_number

```
canadian citizenship
canadian passport
passport application
passport photos
certified translator
canadian citizens
processing times
renewal application
```

#### Keyword\_passport

```
Passport Number
Passport No
Passport #
Passport#
PassportID
Passport no
passport number
パスポート
パスポート番号
パスポートのNum
パスポート＃
Numéro de passeport
Passeport n °
Passeport Non
Passeport #
Passeport#
PasseportNon
Passeportn °
```

## Canada personal health identification number (PHIN)

### Format

nine digits

### Pattern

nine digits

### Keywords

#### Keyword\_canada\_phin

```
social insurance number
health information act
income tax information
manitoba health
health registration
prescription purchases
benefit eligibility
personal health
power of attorney
registration number
personal health number
practitioner referral
wellness professional
patient referral
health and wellness
```

#### Keyword\_canada\_provinces

```
Nunavut
Quebec
Northwest Territories
Ontario
British Columbia
Alberta
Saskatchewan
Manitoba
Yukon
Newfoundland and Labrador
New Brunswick
Nova Scotia
Prince Edward Island
Canada
```

## Canada social insurance number

### Format

nine digits with optional hyphens or spaces

### Pattern

Formatted:

- three digits
- a hyphen or space
- three digits
- a hyphen or space
- three digits

Unformatted: nine digits

### Keywords

#### Keyword\_sin

```
sin
social insurance
numero d'assurance sociale
sins
ssn
ssns
social security
numero d'assurance social
national identification number
national ID
sin#
soc ins
social ins
```

#### Keyword\_sin\_collaborative

```
driver's license
drivers license
driver's license
drivers license
DOB
Birthdate
Birthday
Date of Birth
```

## Chile identity card number

### Format

seven to eight digits plus delimiters a check digit or letter

### Pattern

seven to eight digits plus delimiters:

- one to two digits
- an optional period
- three digits
- an optional period
- three digits
- a dash
- one digit or letter (not case sensitive) which is a check digit

### Keywords

#### Keyword\_chile\_id\_card

```
cédula de identidad
identificación
national identification
national identification number
national ID
número de identificación nacional
rol único nacional
rol único tributario
RUN
RUT
tarjeta de identificación
Rol Unico Nacional
Rol Unico Tributario
RUN#
RUT#
nationaluniqueroleID#
nacional identidad
número identificación
identidad número
numero identificacion
identidad numero
Chilean identity no.
Chilean identity number
Chilean identity #
Unique Tax Registry
Unique Tributary Role
Unique Tax Role
Unique Tributary Number
Unique National Number
Unique National Role
National unique role
Chile identity no.
Chile identity number
Chile identity #
```

## China-resident identity card (PRC) number

### Format

18 digits

### Pattern

18 digits:

- six digits, which are an address code
- eight digits in the form YYYYMMDD, which are the date of birth
- three digits, which are an order code
- one digit, which is a check digit

### Keywords

#### Keyword\_china\_resident\_id

```
Resident Identity Card
PRC
National Identification Card
身份证
居民身份证
居民身份证
鉴定
身分證
居民身份證
鑑定
```

## Credit card number

### Format

14 to 16 digits, which can be formatted or unformatted (dddddddddddddddd) and which must pass the Luhn test.

### Pattern

Complex and robust pattern that detects cards from all major brands worldwide, including Visa, MasterCard, Discover Card, JCB, American Express, gift cards, and diner cards.

### Keywords

#### Keyword\_cc\_verification

```
card verification
card identification number
cvn
cid
cvc2
cvv2
pin block
security code
security number
security no
issue number
issue no
cryptogramme
numéro de sécurité
numero de securite
kreditkartenprüfnummer
kreditkartenprufnummer
prüfziffer
prufziffer
sicherheits Kode
sicherheitscode
sicherheitsnummer
verfalldatum
codice di verifica
cod. sicurezza
cod sicurezza
n autorizzazione
código
codigo
cod. seg
cod seg
código de segurança
codigo de seguranca
codigo de segurança
código de seguranca
cód. segurança
cod. seguranca
cod. segurança
cód. seguranca
cód segurança
cod seguranca
cod segurança
cód seguranca
número de verificação
numero de verificacao
ablauf
gültig bis
gültigkeitsdatum
gultig bis
gultigkeitsdatum
scadenza
data scad
fecha de expiracion
fecha de venc
vencimiento
válido hasta
valido hasta
vto
data de expiração
data de expiracao
data em que expira
validade
valor
vencimento
transaction
transaction number
reference number
セキュリティコード
セキュリティ コード
セキュリティナンバー
セキュリティ ナンバー
セキュリティ番号
```

#### Keyword\_cc\_name

```
amex
Americans express
Americans express
americano espresso
Visa
Mastercard
master card
mc
master cards
master cards
diner's Club
diners club
diners club
discover
discover card
discover card
discover cards
JCB
BrandSmart
japanese card bureau
carte blanche
carteblanche
credit card
cc#
cc#:
expiration date
exp date
expiry date
date d'expiration
date d'exp
date expiration
bank card
bank card
card number
card num
card number
card numbers
card numbers
credit card
credit cards
credit cards
ccn
card holder
cardholder
card holders
cardholders
check card
check card
check cards
check cards
debit card
debit card
debit cards
debit cards
atm card
atmcard
atm cards
atmcards
enroute
en route
card type
Cardmember Acct
cardmember account
Card no
Corporate Card
Corporate cards
Type of card
card account number
card member account
Cardmember Acct.
card no.
card no
card number
carte bancaire
carte de crédit
carte de credit
numéro de carte
numero de carte
nº de la carte
nº de carte
kreditkarte
karte
karteninhaber
karteninhabers
kreditkarteninhaber
kreditkarteninstitut
kreditkartentyp
eigentümername
kartennr
kartennummer
kreditkartennummer
kreditkarten-nummer
carta di credito
carta credito
n. carta
n carta
nr. carta
nr carta
numero carta
numero della carta
numero di carta
tarjeta credito
tarjeta de credito
tarjeta crédito
tarjeta de crédito
tarjeta de atm
tarjeta atm
tarjeta debito
tarjeta de debito
tarjeta débito
tarjeta de débito
nº de tarjeta
no. de tarjeta
no de tarjeta
numero de tarjeta
número de tarjeta
tarjeta no
tarjetahabiente
cartão de crédito
cartão de credito
cartao de crédito
cartao de credito
cartão de débito
cartao de débito
cartão de debito
cartao de debito
débito automático
debito automatico
número do cartão
numero do cartão
número do cartao
numero do cartao
número de cartão
numero de cartão
número de cartao
numero de cartao
nº do cartão
nº do cartao
nº. do cartão
no do cartão
no do cartao
no. do cartão
no. do cartao
クレジットカード番号
クレジットカードナンバー
クレジットカード＃
クレジットカード
クレジット
クレカ
カード番号
カードナンバー
カード＃
アメックス
アメリカンエクスプレス
アメリカン エクスプレス
Visaカード
Visa カード
マスターカード
マスター カード
マスター
ダイナースクラブ
ダイナース クラブ
ダイナース
有効期限
期限
キャッシュカード
キャッシュ カード
カード名義人
カードの名義人
カードの名義
デビット カード
デビットカード
```

## Croatia driver's license number

This sensitive information type entity is only available in the EU Driver's License Number sensitive information type.

### Format

eight digits without spaces and delimiters

### Pattern

eight digits

### Keywords

#### Keywords\_eu\_driver's\_license\_number

```
driverlic
driverlics
driver license
driver licenses
driverlicence
driverlicences
driver lic
driver lics
driver license
driver licenses
driver license
driver licenses
driverslic
driverslics
driverslicence
driverslicences
drivers license
drivers licenses
drivers lic
drivers lics
drivers license
drivers licenses
drivers license
drivers licenses
driver'lic
driver'lics
driver'license
driver'licenses
driver'license
driver'licenses
driver' lic
driver' lics
driver' license
driver' licenses
driver' license
driver' licenses
driver'slic
driver'slics
driver'license
driver'licenses
driver'license
driver'licenses
driver's lic
driver's lics
driver's license
driver's licenses
driver's license
driver's licenses
dl#
dls#
driverlic#
driverlics#
driver license#
driver licenses#
driverlicence#
driverlicences#
driver lic#
driver lics#
driver license#
driver licenses#
driver licenses#
driverslic#
driverslics#
drivers license#
drivers licenses#
driverslicence#
driverslicences#
drivers lic#
drivers lics#
drivers license#
drivers licenses#
drivers license#
drivers licenses#
driver'lic#
driver'lics#
driver'license#
driver'licenses#
driver'license#
driver'licenses#
driver' lic#
driver' lics#
driver' license#
driver' licenses#
driver' license#
driver' licenses#
driver'slic#
driver'slics#
driver'license#
driver'licenses#
driver'license#
driver'licenses#
driver's lic#
driver's lics#
driver's license#
driver's licenses#
driver's license#
driver's licenses#
driving license
driving license
dlno#
driv lic
driv licen
driv license
driv licenses
driv license
driv licenses
driver licen
drivers licen
driver's licen
driving lic
driving licen
driving licenses
driving license
driving licenses
driving permit
dl no
dlno
dl number
```

#### Keywords\_croatia\_eu\_driver's\_license\_number

```
vozačka dozvola
vozačke dozvole
```

## Croatia identity card number

This sensitive information type entity is included in the EU National Identification Number sensitive information type and is available as a stand-alone sensitive information type entity.

### Format

nine digits

### Pattern

nine consecutive digits

### Keywords

#### Keyword\_croatia\_id\_card

```
majstorski broj građana
master citizen number
nacionalni identifikacijski broj
national identification number
oib#
oib
osobna iskaznica
osobni ID
osobni identifikacijski broj
personal identification number
porezni broj
porezni identifikacijski broj
tax ID
tax identification no
tax identification number
tax no#
tax no
tax number
tax registration number
tax ID#
tax ID no#
tax ID number#
tax no#
tax number#
tax number
tin ID
tin no
tin#
```

## Croatia personal identification (OIB) number

### Format

11 digits

### Pattern

11 digits:

- 10 digits
- final digit is a check digit

### Keywords

#### Keyword\_croatia\_oib\_number

```
majstorski broj građana
master citizen number
nacionalni identifikacijski broj
national identification number
oib#
oib
osobna iskaznica
osobni ID
osobni identifikacijski broj
personal identification number
porezni broj
porezni identifikacijski broj
tax ID
tax identification no
tax identification number
tax no#
tax no
tax number
tax registration number
tax ID#
tax ID no#
tax Id number#
tax no#
tax number#
tax number
tin ID
tin no
tin#
```

## Denmark personal identification number

### Format

10 digits containing a hyphen

### Pattern

10 digits:

- six digits in the format DDMMYY, which are the date of birth
- a hyphen
- four digits where the final digit is a check digit

### Keywords

#### Keyword\_denmark\_id

```
centrale person register
civilt registreringssystem
cpr
cpr#
gesundheitskarte nummer
gesundheitsversicherungkarte nummer
health card
health insurance card number
health insurance number
identification number
identifikationsnummer
identifikationsnummer#
identity number
krankenkassennummer
national ID#
national number#
national number
personalidnumber#
personalidentityno#
personal ID number
personnummer
personnummer#
reisekrankenversicherungskartenummer
rejsesygesikringskort
ssn
ssn#
skat ID
skat kode
skat nummer
skattenummer
social security number
sundhedsforsikringskort
sundhedsforsikringsnummer
sundhedskort
sundhedskortnummer
sygesikring
sygesikringkortnummer
tax code
travel health insurance card
uniqueidentityno#
tax number
tax registration number
tax ID
tax identification number
tax ID#
tax number#
tax no
tax no#
tax number
tax identification no
tin#
tax ID no#
tax ID number#
tax no#
tin ID
tin no
cpr.nr
cprnr
cprnummer
personnr
person register
sygesikringsbevis
sygesikringsbevisnr
sygesikringsbevisnummer
sygesikringskort
sygesikringskortnr
sygesikringskortnummer
sygesikringsnr
sygesikringsnummer
```

## EU debit card number

### Format

16 digits

### Pattern

Complex and robust pattern

### Keywords

#### Keyword\_eu\_debit\_card

```
account number
card number
card no.
security number
cc#
```

#### Keyword\_card\_terms\_dict

```
acct nbr
acct num
acct no
Americans express
Americans express
americano espresso
amex
atm card
atm cards
atm kaart
atmcard
atmcards
atmkaart
atmkaarten
ban contact
bank card
bankkaart
card holder
card holders
card num
card number
card numbers
card type
cardano numerico
cardholder
cardholders
card number
card numbers
carta bianca
carta credito
carta di credito
cartao de credito
cartao de crédito
cartao de debito
cartao de débito
carte bancaire
carte blanche
carte bleue
carte de credit
carte de crédit
carte di credito
carteblanche
cartão de credito
cartão de crédito
cartão de debito
cartão de débito
cb
ccn
check card
check cards
check card
check cards
chequekaart
cirrus
cirrus-edc-maestro
controlekaart
controlekaarten
credit card
credit cards
credit card
credit cards
debetkaart
debetkaarten
debit card
debit cards
debit card
debit cards
debito automatico
diners club
diners club
discover
discover card
discover cards
discover card
discover cards
débito automático
edc
eigentümername
european debit card
hoofdkaart
hoofdkaarten
in viaggio
japanese card bureau
japanse kaartdienst
jcb
kaart
kaart num
kaartaantal
kaartaantallen
kaarthouder
kaarthouders
karte
karteninhaber
karteninhabers
kartennr
kartennummer
kreditkarte
kreditkarten-nummer
kreditkarteninhaber
kreditkarteninstitut
kreditkartennummer
kreditkartentyp
maestro
master card
master cards
Mastercard
master cards
mc
mister cash
n carta
carta
no de tarjeta
no do cartao
no do cartão
no. de tarjeta
no. do cartao
no. do cartão
nr carta
nr. carta
numeri di scheda
numero carta
numero de cartao
numero de carte
numero de cartão
numero de tarjeta
numero della carta
numero di carta
numero di scheda
numero do cartao
numero do cartão
numéro de carte
nº carta
nº de carte
nº de la carte
nº de tarjeta
nº do cartao
nº do cartão
nº. do cartão
número de cartao
número de cartão
número de tarjeta
número do cartao
scheda dell'assegno
scheda dell'atmosfera
scheda dell'atmosfera
scheda della banca
scheda di controllo
scheda di debito
scheda matrice
schede dell'atmosfera
schede di controllo
schede di debito
schede matrici
scoprono la scheda
scoprono le schede
solo
supporti di scheda
supporto di scheda
switch
tarjeta atm
tarjeta credito
tarjeta de atm
tarjeta de credito
tarjeta de debito
tarjeta debito
tarjeta no
tarjetahabiente
tipo della scheda
ufficio giapponese della
scheda
v pay
v-pay
visa
visa plus
visa electron
visto
visum
vpay
```

#### Keyword\_card\_security\_terms\_dict

```
card identification number
card verification
cardi la verifica
cid
cod seg
cod seguranca
cod segurança
cod sicurezza
cod. seg
cod. seguranca
cod. segurança
cod. sicurezza
codice di sicurezza
codice di verifica
codigo
codigo de seguranca
codigo de segurança
crittogramma
cryptogram
cryptogramme
cv2
cvc
cvc2
cvn
cvv
cvv2
cód seguranca
cód segurança
cód. seguranca
cód. segurança
código
código de seguranca
código de segurança
de kaart controle
geeft nr uit
issue no
issue number
kaartidentificatienummer
kreditkartenprufnummer
kreditkartenprüfnummer
kwestieaantal
no. dell'edizione
no. di sicurezza
numero de securite
numero de verificacao
numero dell'edizione
numero di identificazione della
scheda
numero di sicurezza
numero van veiligheid
numéro de sécurité
nº autorizzazione
número de verificação
perno il blocco
pin block
prufziffer
prüfziffer
security code
security no
security number
sicherheits kode
sicherheitscode
sicherheitsnummer
speldblok
veiligheid nr
veiligheidsaantal
veiligheidscode
veiligheidsnummer
verfalldatum
```

#### Keyword\_card\_expiration\_terms\_dict

```
ablauf
data de expiracao
data de expiração
data del exp
data di exp
data di scadenza
data em que expira
data scad
data scadenza
date de validité
datum afloop
datum van exp
de afloop
espira
espira
exp date
exp datum
expiration
expire
expires
expiry
fecha de expiracion
fecha de venc
gultig bis
gultigkeitsdatum
gültig bis
gültigkeitsdatum
la scadenza
scadenza
valable
validade
valido hasta
valor
venc
vencimento
vencimiento
verloopt
vervaldag
vervaldatum
vto
válido hasta
```

## EU driver's license number

These are the entities in the EU Driver's License Number sensitive information type.

- Austria
- Belgium
- Bulgaria
- Croatia
- Cyprus
- Czech
- Denmark
- Estonia
- Finland
- France
- Germany
- Greece
- Hungary
- Ireland
- Italy
- Latvia
- Lithuania
- Luxemburg
- Malta
- Netherlands
- Poland
- Portugal
- Romania
- Slovakia
- Slovenia
- Spain
- Sweden
- U.K.

## EU national identification number

These are the entities in the EU National Identification Number sensitive information type.

- Austria
- Belgium
- Bulgaria
- Croatia
- Cyprus
- Czech
- Denmark
- Estonia
- Finland
- France
- Germany
- Greece
- Hungary
- Ireland
- Italy
- Latvia
- Lithuania
- Luxemburg
- Malta
- Netherlands
- Poland
- Portugal
- Romania
- Slovakia
- Slovenia
- Spain
- U.K.

## EU passport number

These are the entities in the EU passport number sensitive information typeThese are the entities in the EU passport number bundle.

- Austria
- Belgium
- Bulgaria
- Croatia
- Cyprus
- Czech
- Denmark
- Estonia
- Finland
- France
- Germany
- Greece
- Hungary
- Ireland
- Italy
- Latvia
- Lithuania
- Luxemburg
- Malta
- Netherlands
- Poland
- Portugal
- Romania
- Slovakia
- Slovenia
- Spain
- Sweden
- U.K.

## EU social security number or equivalent identification

These are the entities that are in the EU Social Security Number or equivalent identification sensitive information type.

- Austria
- Belgium
- Croatia
- Czech
- Denmark
- Finland
- France
- Germany
- Greece
- Hungary
- Portugal
- Spain
- Sweden

## EU Tax identification number

These entities are in the EU Tax identification number sensitive information type.

- Austria
- Belgium
- Bulgaria
- Croatia
- Cyprus
- Czech
- Denmark
- Estonia
- Finland
- France
- Germany
- Greece
- Hungary
- Ireland
- Italy
- Latvia
- Lithuania
- Luxemburg
- Malta
- Netherlands
- Poland
- Portugal
- Romania
- Slovakia
- Slovenia
- Spain
- Sweden
- U.K.



## Finland national ID

### Format

six digits plus a character indicating a century plus three digits plus a check digit

### Pattern

Pattern must include all of the following:

- six digits in the format DDMMYY, which are a date of birth
- century marker (either '-', '+' or 'a')
- three-digit personal identification number
- a digit or letter (case insensitive) which is a check digit

### Keywords

```
ainutlaatuinen henkilökohtainen tunnus
henkilökohtainen tunnus
henkilötunnus
henkilötunnusnumero#
henkilötunnusnumero
hetu
ID no
ID number
identification number
identiteetti numero
identity number
ID number
kansallinen henkilötunnus
kansallisen henkilökortin
national ID card
national ID no.
personal ID
personal identity code
personalidnumber#
personbeteckning
personnummer
social security number
sosiaaliturvatunnus
tax ID
tax identification no
tax identification number
tax no#
tax no
tax number
tax registration number
tax ID#
tax ID no#
tax ID number#
tax no#
tax number#
tax number
tin ID
tin no
tin#
tunnistenumero
tunnus numero
tunnusluku
tunnusnumero
verokortti
veronumero
verotunniste
verotunnus
```

## Finland passport number

This sensitive information type entity is available in the EU Passport Number sensitive information type and is available as a stand-alone sensitive information type entity.

### Format

combination of nine letters and digits

### Pattern

combination of nine letters and digits:

- two letters (not case sensitive)
- seven digits

### Keywords

#### Keywords\_eu\_passport\_number\_common

```
passport#
passport #
passport ID
passports
passport no
passport no
passport number
passport number
passport numbers
passport numbers
```

#### Keyword\_finland\_passport\_number

```
suomalainen passi
passin numero
passin numero.#
passin numero#
passin numero.
passi#
passi number
```

## France driver's license number

This sensitive information type entity is available in the EU Driver's License Number sensitive information type and is available as a stand-alone sensitive information type entity.

### Format

12 digits

### Pattern

12 digits with validation to discount similar patterns such as French telephone numbers

### Keywords

#### Keyword\_french\_drivers\_license

```
driverlic
driverlics
driver license
driver licenses
driverlicence
driverlicences
driver lic
driver lics
driver license
driver licenses
driver license
driver licenses
driverslic
driverslics
driverslicence
driverslicences
drivers license
drivers licenses
drivers lic
drivers lics
drivers license
drivers licenses
drivers license
drivers licenses
driver'lic
driver'lics
driver'license
driver'licenses
driver'license
driver'licenses
driver' lic
driver' lics
driver' license
driver' licenses
driver' license
driver' licenses
driver'slic
driver'slics
driver'license
driver'licenses
driver'license
driver'licenses
driver's lic
driver's lics
driver's license
driver's licenses
driver's license
driver's licenses
dl#
dls#
driverlic#
driverlics#
driver license#
driver licenses#
driverlicence#
driverlicences#
driver lic#
driver lics#
driver license#
driver licenses#
driver licenses#
driverslic#
driverslics#
drivers license#
drivers licenses#
driverslicence#
driverslicences#
drivers lic#
drivers lics#
drivers license#
drivers licenses#
drivers license#
drivers licenses#
driver'lic#
driver'lics#
driver'license#
driver'licenses#
driver'license#
driver'licenses#
driver' lic#
driver' lics#
driver' license#
driver' licenses#
driver' license#
driver' licenses#
driver'slic#
driver'slics#
driver'license#
driver'licenses#
driver'license#
driver'licenses#
driver's lic#
driver's lics#
driver's license#
driver's licenses#
driver's license#
driver's licenses#
driving license
driving license
dlno#
driv lic
driv licen
driv license
driv licenses
driv license
driv licenses
driver licen
drivers licen
driver's licen
driving lic
driving licen
driving licenses
driving license
driving licenses
driving permit
dl no
dlno
dl number
permis de conduire
license number
license number
license numbers
license numbers
numéros de license
```

## France national ID card (CNI)

### Format

12 digits

### Pattern

12 digits

### Keywords

#### Keywords\_france\_eu\_national\_id\_card

```
card number
carte nationale d'identité
carte nationale d'idenite no
cni#
cni
compte bancaire
national identification number
national identity
nationalidno#
numéro d'assurance maladie
numéro de carte vitale
```

## France passport number

This sensitive information type entity is available in the EU Passport Number sensitive information type and is available as a stand-alone sensitive information type entity.

### Format

nine digits and letters

### Pattern

nine digits and letters:

- two digits
- two letters (not case sensitive)
- five digits

### Keywords

#### Keyword\_passport

```
Passport Number
Passport No
Passport #
Passport#
PassportID
Passport no
passport number
パスポート
パスポート番号
パスポートのNum
パスポート＃
Numéro de passeport
Passeport n °
Passeport Non
Passeport #
Passeport#
PasseportNon
Passeportn °
```

## France social security number (INSEE) or equivalent identification

This sensitive information type entity is included in the EU Social Security Number and Equivalent ID sensitive information type and is available as a stand-alone sensitive information type entity.

### Format

15 digits

### Pattern

Must match one of two patterns:

- 13 digits followed by a space followed by two digits
 or
- 15 consecutive digits

### Keywords

#### Keyword\_fr\_insee

```
insee
securité sociale
securite sociale
national ID
national identification
numéro d'identité
no d'identité
no. d'identité
numero d'identite
no d'identite
no. d'identite
social security number
social security code
social insurance number
le numéro d'identification nationale
d'identité nationale
numéro de sécurité sociale
le code de la sécurité sociale
numéro d'assurance sociale
numéro de sécu
code sécu
```

## Germany driver's license number

This sensitive information type entity is included in the EU Driver's License Number sensitive information type and is available as a stand-alone sensitive information type entity.

### Format

combination of 11 digits and letters

### Pattern

11 digits and letters (not case sensitive):

- a digit or letter
- two digits
- six digits or letters
- a digit
- a digit or letter

### Keywords

#### Keyword\_german\_drivers\_license\_number

```
ausstellungsdatum
ausstellungsort
ausstellende behöde
ausstellende behorde
ausstellende behoerde
führerschein
fuhrerschein
fuehrerschein
führerscheinnummer
fuhrerscheinnummer
fuehrerscheinnummer
führerschein-
fuhrerschein-
fuehrerschein-
führerscheinnummernr
fuhrerscheinnummernr
fuehrerscheinnummernr
führerscheinnummerklasse
fuhrerscheinnummerklasse
fuehrerscheinnummerklasse
nr-führerschein
nr-fuhrerschein
nr-fuehrerschein
no-führerschein
no-fuhrerschein
no-fuehrerschein
n-führerschein
n-fuhrerschein
n-fuehrerschein
permis de conduire
driverlic
driverlics
driver license
driver licenses
driverlicence
driverlicences
driver lic
driver lics
driver license
driver licenses
driver license
driver licenses
driverslic
driverslics
driverslicence
driverslicences
drivers license
drivers licenses
drivers lic
drivers lics
drivers license
drivers licenses
drivers license
drivers licenses
driver'lic
driver'lics
driver'license
driver'licenses
driver'license
driver'licenses
driver' lic
driver' lics
driver' license
driver' licenses
driver' license
driver' licenses
driver'slic
driver'slics
driver'license
driver'licenses
driver'license
driver'licenses
driver's lic
driver's lics
driver's license
driver's licenses
driver's license
driver's licenses
dl#
dls#
driverlic#
driverlics#
driver license#
driver licenses#
driverlicence#
driverlicences#
driver lic#
driver lics#
driver license#
driver licenses#
driver licenses#
driverslic#
driverslics#
drivers license#
drivers licenses#
driverslicence#
driverslicences#
drivers lic#
drivers lics#
drivers license#
drivers licenses#
drivers license#
drivers licenses#
driver'lic#
driver'lics#
driver'license#
driver'licenses#
driver'license#
driver'licenses#
driver' lic#
driver' lics#
driver' license#
driver' licenses#
driver' license#
driver' licenses#
driver'slic#
driver'slics#
driver'license#
driver'licenses#
driver'license#
driver'licenses#
driver's lic#
driver's lics#
driver's license#
driver's licenses#
driver's license#
driver's licenses#
driving license
driving license
dlno#
driv lic
driv licen
driv license
driv licenses
driv license
driv licenses
driver licen
drivers licen
driver's licen
driving lic
driving licen
driving licenses
driving license
driving licenses
driving permit
dlno
```

## Germany identity card number

### Format

since 1 November 2010: Nine letters and digits

from 1 April 1987 until 31 October 2010: 10 digits

### Pattern

since 1 November 2010:

- one letter (not case sensitive)
- eight digits

from 1 April 1987 until 31 October 2010:

- 10 digits

### Keywords

#### Keyword\_germany\_id\_card

```
ausweis
gpid
identification
identifikation
identifizierungsnummer
identity card
identity number
id-nummer
personal ID
personalausweis
persönliche ID nummer
persönliche identifikationsnummer
persönliche-id-nummer
```

## Germany passport number

This sensitive information type entity is included in the EU Passport Number sensitive information type and is available as a stand-alone sensitive information type entity.

### Format

10 digits or letters

### Pattern

Pattern must include all of the following:

- first character is a digit or a letter from this set (C, F, G, H, J, K)
- three digits
- five digits or letters from this set (C, -H, J-N, P, R, T, V-Z)
- a digit

### Keywords

#### Keyword\_german\_passport

```
reisepasse
reisepassnummer
No-Reisepass
Nr-Reisepass
Reisepass-Nr
Passnummer
reisepässe
passeport no.
passeport no
```

## Greece national ID card

### Format

Combination of 7-8 letters and numbers plus a dash

### Pattern

Seven letters and numbers (old format):

- One letter (any letter of the Greek alphabet)
- A dash
- Six digits

Eight letters and numbers (new format):

- Two letters whose uppercase character occurs in both the Greek and Latin alphabets (ABEZHIKMNOPTYX)
- A dash
- Six digits

### Keywords

#### Keyword\_greece\_id\_card

```
greek ID
greek national ID
greek personal ID card
greek police ID
identity card
tautotita
ταυτότητα
ταυτότητας
```

## Hong Kong identity card (HKID) number

### Format

Combination of 8-9 letters and numbers plus optional parentheses around the final character

### Pattern

Combination of 8-9 letters:

- 1-2 letters (not case sensitive)
- Six digits
- The final character (any digit or the letter A), which is the check digit and is optionally enclosed in parentheses.

### Keywords

#### Keyword\_hong\_kong\_id\_card

```
hkid
Hong Kong identity card
HKIDC
ID card
identity card
hk identity card
Hong Kong ID
香港身份證
香港永久性居民身份證
身份證
身份証
身分證
身分証
香港身份証
香港身分證
香港身分証
香港身份證
香港居民身份證
香港居民身份証
香港居民身分證
香港居民身分証
香港永久性居民身份証
香港永久性居民身分證
香港永久性居民身分証
香港永久性居民身份證
香港非永久性居民身份證
香港非永久性居民身份証
香港非永久性居民身分證
香港非永久性居民身分証
香港特別行政區永久性居民身份證
香港特別行政區永久性居民身份証
香港特別行政區永久性居民身分證
香港特別行政區永久性居民身分証
香港特別行政區非永久性居民身份證
香港特別行政區非永久性居民身份証
香港特別行政區非永久性居民身分證
香港特別行政區非永久性居民身分証
```

## IP address

### Format

#### IPv4:

Complex pattern, which accounts for formatted (periods) and unformatted (no periods) versions of the IPv4 addresses

#### IPv6:

Complex pattern that accounts for formatted IPv6 numbers (which include colons)

### Pattern

### Keywords

#### Keyword\_ipaddress

```
IP (this keyword is case-sensitive)
ip address
ip addresses
internet protocol
IP-כתובת ה
```

## India permanent account number (PAN)

### Format

10 letters or digits

### Pattern

10 letters or digits:

- Three letters (not case sensitive)
- A letter in C, P, H, F, A, T, B, L, J, G (not case sensitive)
- A letter
- Four digits
- A letter (not case sensitive)

### Keywords

#### Keyword\_india\_permanent\_account\_number

```
Permanent Account Number
PAN
```

## India unique identification (Aadhaar) number

### Format

12 digits containing optional spaces or dashes

### Pattern

12 digits:

- A digit, which is not 0 or 1
- Three digits
- An optional space or dash
- Four digits
- An optional space or dash
- The final digit, which is the check digit

### Keywords

#### Keyword\_india\_aadhar

```
aadhaar
aadhar
aadhar#
uid
आधार
uidai
```

## Indonesia identity card (KTP) number

### Format

16 digits containing optional periods

### Pattern

16 digits:

- Two-digit province code
- A period (optional)
- Two-digit regency or city code
- Two-digit subdistrict code
- A period (optional)
- Six digits in the format DDMMYY, which are the date of birth
- A period (optional)
- Four digits

### Keywords

#### Keyword\_indonesia\_id\_card

```
KTP
Kartu Tanda Penduduk
Nomor Induk Kependudukan
```

## International banking account number (IBAN)

### Format

Country code (two letters) plus check digits (two digits) plus :::no-loc text="bban"::: number (up to 30 characters)

### Pattern

Pattern must include all of the following:

- Two-letter country code
- Two check digits (followed by an optional space)
- 1-7 groups of four letters or digits (can be separated by spaces)
- 1-3 letters or digits

The format for each country is slightly different. The IBAN sensitive information type covers these 60 countries:

```
ad, ae, al, at, az, ba, be, bg, bh, ch, cr, cy, cz, de, dk, do, ee, es, fi, fo, fr, gb, ge, gi, gl, gr, hr, hu, that is, il, is, it, kw, kz, lb, li, lt, lu, lv, mc, md, me, mk, mr, mt, mu, nl, no, pl, pt, ro, rs, sa, se, si, sk, sm, tn, tr, vg
```

### Keywords

None

## Ireland personal public service (PPS) number

### Format

Old format (until 31 Dec 2012):

- seven digits followed by 1-2 letters

New format (1 Jan 2013 and after):

- seven digits followed by two letters

### Pattern

Old format (until 31 Dec 2012):

- seven digits
- one to two letters (not case sensitive)

New format (1 Jan 2013 and after):

- seven digits
- a letter (not case sensitive) which is an alphabetic check digit
- An optional letter in the range A-I, or &quot;W&quot;

### Keywords

#### Keywords\_ireland\_eu\_national\_id\_card

```
client identity service
identification number
personal ID number
personal public service number
personal service no
phearsanta seirbhíse poiblí
pps no
pps number
pps num
pps service no
ppsn
ppsno#
ppsno
psp
public service no
publicserviceno#
publicserviceno
revenue and social insurance number
rsi no
rsi number
rsin
seirbhís aitheantais cliant
uimh
uimhir aitheantais chánach
uimhir aitheantais phearsanta
uimhir phearsanta seirbhíse poiblí
tax ID
tax identification no
tax identification number
tax no#
tax no
tax number
tax registration number
tax ID#
tax ID no#
tax ID number#
tax no#
tax number#
tax number
tin ID
tin no
tin#
```

## Israel bank account number

### Format

13 digits

### Pattern

Formatted:

- two digits
- a dash
- three digits
- a dash
- eight digits

Unformatted:

- 13 consecutive digits

### Keywords

#### Keyword\_israel\_bank\_account\_number

```
Bank Account Number
Bank Account
Account Number
מספר חשבון בנק
```

## Israel national identification number

### Format

nine digits

### Pattern

nine consecutive digits

### Keywords

#### Keyword\_Israel\_National\_ID

```
מספר זהות
מספר זיה וי
מספר זיהוי ישר אלי
זהותישר אלית
هو ية اسرائيل ية عدد
هوية إسرائ يلية
رقم الهوية
عدد هوية فريدة من نوعها
ID number#
ID number
identity no
identity number#
identity number
israeliidentitynumber
personal ID
unique ID
```

## Italy driver's license number

This sensitive information type entity is included in the EU Driver's License Number sensitive information type and is available as a stand-alone sensitive information type entity.

### Format

a combination of 10 letters and digits

### Pattern

a combination of 10 letters and digits:

- one letter (not case sensitive)
- the letter &quot;A&quot; or &quot;V&quot; (not case sensitive)
- seven digits
- one letter (not case sensitive)

### Keywords

#### Keyword\_italy\_drivers\_license\_number

```
numero di patente
patente di guida
patente guida
patenti di guida
patenti guida
```

## Japan bank account number

### Format

seven or eight digits

### Pattern

bank account number:

- seven or eight digits
- bank account branch code:
- four digits
- a space or dash (optional)
- three digits

### Keywords

#### Keyword\_jp\_bank\_account

```
Checking Account Number
Checking Account
Checking Account #
Checking Acct Number
Checking Acct #
Checking Acct No.
Checking Account No.
Bank Account Number
Bank Account
Bank Account #
Bank Acct Number
Bank Acct #
Bank Acct No.
Bank Account No.
Savings Account Number
Savings Account
Savings Account #
Savings Acct Number
Savings Acct #
Savings Acct No.
Savings Account No.
Debit Account Number
Debit Account
Debit Account #
Debit Acct Number
Debit Acct #
Debit Acct No.
Debit Account No.
口座番号
銀行口座
銀行口座番号
総合口座
普通預金口座
普通口座
当座預金口座
当座口座
預金口座
振替口座
銀行
バンク
```

#### Keyword\_jp\_bank\_branch\_code

```
支店番号
支店コード
店番号
```

## Japan driver's license number

### Format

12 digits

### Pattern

12 consecutive digits

### Keywords

#### Keyword\_jp\_drivers\_license\_number

```
driver license
drivers license
driver'license
drivers licenses
driver'licenses
driver licenses
dl#
dls#
lic#
lics#
運転免許証
運転免許
免許証
免許
運転免許証番号
運転免許番号
免許証番号
免許番号
運転免許証ナンバー
運転免許ナンバー
免許証ナンバー
運転免許証no
運転免許no
免許証no
免許no
運転経歴証明書番号
運転経歴証明書
運転免許証No.
運転免許No.
免許証No.
免許No.
運転免許証#
運転免許#
免許証#
免許#
```

## Japan passport number

### Format

two letters followed by seven digits

### Pattern

two letters (not case sensitive) followed by seven digits

#### Keyword\_jp\_passport

```
Passport
Passport Number
Passport No.
Passport #
パスポート
パスポート番号
パスポートナンバー
パスポート＃
パスポート#
パスポートNo.
旅券番号
旅券番号＃
旅券番号♯
旅券ナンバー
```

## Japan residence card number

### Format

12 letters and digits

### Pattern

12 letters and digits:

- two letters (not case sensitive)
- eight digits
- two letters (not case sensitive)

### Keywords

#### Keyword\_jp\_residence\_card\_number

```
Residence card number
Residence card no
Residence card #
在留カード番号
在留カード
在留番号
```

## Japan-resident registration number

### Format

11 digits

### Pattern

11 consecutive digits

### Keywords

#### Keyword\_jp\_resident\_registration\_number

```
Resident Registration Number
Residents Basic Registry Number
Resident Registration No.
Resident Register No.
Residents Basic Registry No.
Basic Resident Register No.
外国人登録証明書番号
証明書番号
登録番号
外国人登録証
```

## Japan social insurance number (SIN)

### Format

7-12 digits

### Pattern

7-12 digits:

- four digits
- a hyphen (optional)
- six digits OR
- 7-12 consecutive digits

### Keywords

#### Keyword\_jp\_sin

```
Social Insurance No.
Social Insurance Num
Social Insurance Number
健康保険被保険者番号
健保番号
基礎年金番号
雇用保険被保険者番号
雇用保険番号
保険証番号
社会保険番号
社会保険No.
社会保険
介護保険
介護保険被保険者番号
健康保険被保険者整理番号
雇用保険被保険者整理番号
厚生年金
厚生年金被保険者整理番号
```

## Malaysia identification card number

### Format

12 digits containing optional hyphens

### Pattern

12 digits:

- six digits in the format YYMMDD, which are the date of birth
- a dash (optional)
- two-letter place-of-birth code
- a dash (optional)
- three random digits
- one-digit gender code

### Keywords

#### Keyword\_malaysia\_id\_card\_number

```
digital application card
i/c
i/c no
ic
ic no
ID card
identification Card
identity card
k/p
k/p no
kad akuan diri
kad aplikasi digital
kad pengenalan malaysia
kp
kp no
mykad
mykas
mykid
mypr
mytentera
malaysia identity card
malaysian identity card
nric
personal identification card
```

## Netherlands citizen's service (BSN) number

### Format

eight-nine digits containing optional spaces

### Pattern

eight-nine digits:

- three digits
- a space (optional)
- three digits
- a space (optional)
- two-three digits

### Keywords

#### Keywords\_netherlands\_eu\_national\_id\_card

```
bsn#
bsn
burgerservicenummer
citizen service number
person number
personal number
personal numeric code
person-related number
persoonlijk nummer
persoonlijke numerieke code
persoonsgebonden
persoonsnummer
sociaal-fiscaal nummer
social-fiscal number
sofi
sofinummer
uniek identificatienummer
uniek identiteitsnummer
unique identification number
unique identity number
uniqueidentityno#
```

## New Zealand ministry of health number

### Format

three letters, a space (optional), and four digits

### Pattern

- three letters (not case sensitive) except 'I' and 'O'
- a space (optional)
- four digits

### Keywords

#### Keyword\_nz\_terms

```
NHI
New Zealand
Health
treatment
National Health Index Number
nhi number
nhi no.
NHI#
National Health Index No.
National Health Index Id
National Health Index #
```

## Norway identification number

### Format

11 digits

### Pattern

11 digits:

- six digits in the format DDMMYY, which are the date of birth
- three-digit individual number
- two check digits

### Keywords

#### Keyword\_norway\_id\_number

```
Personal identification number
Norwegian ID Number
ID Number
Identification
Personnummer
Fødselsnummer
```

## Philippines unified multi-purpose identification number

### Format

12 digits separated by hyphens

### Pattern

12 digits:

- four digits
- a hyphen
- seven digits
- a hyphen
- one digit

### Keywords

#### Keyword\_philippines\_id

```
Unified Multi-Purpose ID
UMID
Identity Card
Pinag-isang Multi-Layunin ID
```

## Poland identity card

### Format

three letters and six digits

### Pattern

three letters (not case sensitive) followed by six digits

### Keywords

#### Keyword\_poland\_national\_id\_passport\_number

```
Dowód osobisty
Numer dowodu osobistego
Nazwa i numer dowodu osobistego
Nazwa i nr dowodu osobistego
Nazwa i nr dowodu tożsamości
Dowód Tożsamości
dow. os.
```

## Poland national ID (PESEL)

### Format

11 digits

### Pattern

- 6 digits representing date of birth in the format YYMMDD
- 4 digits
- 1 check digit

### Keywords

#### Keyword\_pesel\_identification\_number

```
dowód osobisty
dowódosobisty
niepowtarzalny numer
niepowtarzalnynumer
nr.-pesel
nr-pesel
numer identyfikacyjny
pesel
tożsamości narodowej
```

## Poland passport number

This sensitive information type entity is included in the EU Passport Number sensitive information type and is available as a stand-alone sensitive information type entity.

### Format

two letters and seven digits

### Pattern

Two letters (not case sensitive) followed by seven digits

### Keywords

#### Keyword\_poland\_national\_id\_passport\_number

```
Numer paszportu
Nr. Paszportu
Paszport
```

## Portugal citizen card number

### Format

eight digits

### Pattern

eight digits

### Keywords

#### Keyword\_portugal\_citizen\_card

```
bilhete de identidade
cartão de cidadão
citizen card
document number
documento de identificação
ID number
identification no
identification number
identity card no
identity card number
national ID card
nic
número bi de portugal
número de identificação civil
número de identificação fiscal
número do documento
portugal bi number
```

## Portugal driver's license number

This sensitive information type entity is only available in the EU Driver's License Number sensitive information type.

### Format

two patterns - two letters followed by 5-8 digits with special characters

### Pattern

Pattern 1: Two letters followed by 5/6 with special characters:

- Two letters (not case-sensitive)
- A hyphen
- Five or Six digits
- A space
- One digit

Pattern 2: One letter followed by 6/8 digits with special characters:

- One letter (not case-sensitive)
- A hyphen
- Six or eight digits
- A space
- One digit

### Keywords

#### Keywords\_eu\_driver's\_license\_number

```
driverlic
driverlics
driver license
driver licenses
driverlicence
driverlicences
driver lic
driver lics
driver license
driver licenses
driver license
driver licenses
driverslic
driverslics
driverslicence
driverslicences
drivers license
drivers licenses
drivers lic
drivers lics
drivers license
drivers licenses
drivers license
drivers licenses
driver'lic
driver'lics
driver'license
driver'licenses
driver'license
driver'licenses
driver' lic
driver' lics
driver' license
driver' licenses
driver' license
driver' licenses
driver'slic
driver'slics
driver'license
driver'licenses
driver'license
driver'licenses
driver's lic
driver's lics
driver's license
driver's licenses
driver's license
driver's licenses
dl#
dls#
driverlic#
driverlics#
driver license#
driver licenses#
driverlicence#
driverlicences#
driver lic#
driver lics#
driver license#
driver licenses#
driver licenses#
driverslic#
driverslics#
drivers license#
drivers licenses#
driverslicence#
driverslicences#
drivers lic#
drivers lics#
drivers license#
drivers licenses#
drivers license#
drivers licenses#
driver'lic#
driver'lics#
driver'license#
driver'licenses#
driver'license#
driver'licenses#
driver' lic#
driver' lics#
driver' license#
driver' licenses#
driver' license#
driver' licenses#
driver'slic#
driver'slics#
driver'license#
driver'licenses#
driver'license#
driver'licenses#
driver's lic#
driver's lics#
driver's license#
driver's licenses#
driver's license#
driver's licenses#
driving license
driving license
dlno#
driv lic
driv licen
driv license
driv licenses
driv license
driv licenses
driver licen
drivers licen
driver's licen
driving lic
driving licen
driving licenses
driving license
driving licenses
driving permit
dl no
dlno
dl number
```

#### Keywords\_portugal\_eu\_driver's\_license\_number

```
carteira de motorista
carteira motorista
carteira de habilitação
carteira habilitação
número de licença
número licença
permissão de condução
permissão condução
Licença condução Portugal
carta de condução
```

## Saudi Arabia National ID

### Format

10 digits

### Pattern

10 consecutive digits

### Keywords

#### Keyword\_saudi\_arabia\_national\_id

```
Identification Card
I card number
ID number
الوطنية الهوية بطاقة رقم
```

## Singapore national registration identity card (NRIC) number

### Format

nine letters and digits

### Pattern

- nine letters and digits:
- the letter &quot;F&quot;, &quot;G&quot;, &quot;S&quot;, or &quot;T&quot; (not case sensitive)
- seven digits
- an alphabetic check digit

### Keywords

#### Keyword\_singapore\_nric

```
National Registration Identity Card
Identity Card Number
NRIC
IC
Foreign Identification Number
FIN
身份证
身份證
```

## South Africa identification number

### Format

13 digits that may contain spaces

### Pattern

13 digits:

- six digits in the format YYMMDD, which are the date of birth
- four digits
- a single-digit citizenship indicator
- the digit &quot;8&quot; or &quot;9&quot;
- one digit, which is a checksum digit

### Keywords

#### Keyword\_south\_africa\_identification\_number

```
Identity card
ID
Identification
```

## South Korea resident registration number

### Format

13 digits containing a hyphen

### Pattern

13 digits:

- six digits in the format YYMMDD, which are the date of birth
- a hyphen
- one digit determined by the century and gender
- four-digit region-of-birth code
- one digit used to differentiate people for whom the preceding numbers are identical
- a check digit.

### Keywords

#### Keyword\_south\_korea\_resident\_number

```
National ID card
Citizen's Registration Number
Jumin deungnok beonho
RRN
주민등록번호
```

## Spain social security number (SSN)

This sensitive information type entity is included in the EU Social Security Number or Equivalent ID sensitive information type and is available as a stand-alone sensitive information type entity.

### Format

11-12 digits

### Pattern

11-12 digits:

- two digits
- a forward slash (optional)
- seven to eight digits
- a forward slash (optional)
- two digits

### Keywords

None

## Sweden national ID

### Format

10 or 12 digits and an optional delimiter

### Pattern

10 or 12 digits and an optional delimiter:

- two digits (optional)
- Six digits in date format YYMMDD
- delimiter of &quot;-&quot; or &quot;+&quot; (optional)
- four digits

### Keywords

#### Keywords\_swedish\_national\_identifier

```
ID no
ID number
ID#
identification no
identification number
identifikationsnumret#
identifikationsnumret
identitetshandling
identity document
identity no
identity number
id-nummer
personal ID
personnummer#
personnummer
skatteidentifikationsnummer
```

## Sweden passport number

This sensitive information type entity is included in the EU Passport Number sensitive information type and is available as a stand-alone sensitive information type entity.

### Format

eight digits

### Pattern

eight consecutive digits

### Keywords

#### Keyword\_sweden\_passport

```
visa requirements
Alien Registration Card
Schengen visas
Schengen visa
Visa Processing
Visa Type
Single Entry
Multiple Entries
G3 Processing Fees
```

#### Keyword\_passport

```
Passport Number
Passport No
Passport #
Passport#
PassportID
Passport no
passport number
パスポート
パスポート番号
パスポートのNum
パスポート＃
Numéro de passeport
Passeport n °
Passeport Non
Passeport #
Passeport#
PasseportNon
Passeportn °
```

## SWIFT code

### Format

four letters followed by 5-31 letters or digits

### Pattern

four letters followed by 5-31 letters or digits:

- four-letter bank code (not case sensitive)
- an optional space
- 4-28 letters or digits (the Basic Bank Account Number (BBAN))
- an optional space
- one to three letters or digits (remainder of the BBAN)

### Keywords

#### Keyword\_swift

```
international organization for standardization 9362
iso 9362
iso9362
swift#
swift code
swift number
swiftroutingnumber
swift code
swift number #
swift routing number
bic number
bic code
bic #
bic#
bank identifier code
Organization internationale de normalization 9362
rapide #
code SWIFT
le numéro de swift
swift numéro d'acheminement
le numéro BIC
#BIC
code identificateur de banque
SWIFTコード
SWIFT番号
BIC番号
BICコード
SWIFT コード
SWIFT 番号
BIC 番号
BIC コード
金融機関識別コード
金融機関コード
銀行コード
```

## Taiwan national identification number

### Format

one letter (in English) followed by nine digits

### Pattern

one letter (in English) followed by nine digits:

- one letter (in English, not case sensitive)
- the digit &quot;1&quot; or &quot;2&quot;
- eight digits

### Keywords

#### Keyword\_taiwan\_national\_id

```
身份證字號
身份證
身份證號碼
身份證號
身分證字號
身分證
身分證號碼
身份證號
身分證統一編號
國民身分證統一編號
簽名
蓋章
簽名或蓋章
簽章
```

## Taiwan passport number

### Format

- biometric passport number: nine digits
- non-biometric passport number: nine digits

### Pattern

biometric passport number:

- the character &quot;3&quot;
- eight digits

non-biometric passport number:

- nine digits

### Keywords

#### Keyword\_taiwan\_passport

```
ROC passport number
Passport number
Passport no
Passport Num
Passport #
护照
中華民國護照
Zhōnghuá Mínguó hùzhào
```

## Taiwan-resident certificate (ARC/TARC) number

### Format

10 letters and digits

### Pattern

10 letters and digits:

- two letters (not case sensitive)
- eight digits

### Keywords

#### Keyword\_taiwan\_resident\_certificate

```
Resident Certificate
Resident Cert
Resident Cert.
Identification card
Alien Resident Certificate
ARC
Taiwan Area Resident Certificate
TARC
居留證
外僑居留證
台灣地區居留證
```

## U.K. driver's license number

This sensitive information type entity is included in the EU Driver's License Number sensitive information type and is available as a stand-alone sensitive information type entity.

### Format

Combination of 18 letters and digits in the specified format

### Pattern

18 letters and digits:

- five letters (not case sensitive) or the digit &quot;9&quot; in place of a letter
- one digit
- five digits in the date format MMDDY for date of birth (7th character is incremented by 50 if driver is female, that is, 51 to 62 instead of 01 to 12)
- two letters (not case sensitive) or the digit &quot;9&quot; in place of a letter
- five digits

### Keywords

#### Keyword\_uk\_drivers\_license

```
DVLA
light vans
quad bikes
motor cars
125cc
sidecar
tricycles
motorcycles
photo card license
learner drivers
license holder
license holders
driving licenses
driving license
dual control car
```

## U.K. electoral roll number

### Format

two letters followed by 1-4 digits

### Pattern

two letters (not case sensitive) followed by 1-4 numbers

### Keywords

#### Keyword\_uk\_electoral

- council nomination
- nomination form
- electoral register
- electoral roll

## U.K. national health service number

### Format

10-17 digits separated by spaces

### Pattern

10-17 digits:

- either three or 10 digits
- a space
- three digits
- a space
- four digits

### Keywords

#### Keyword\_uk\_nhs\_number

```
national health service
nhs
health services authority
health authority
```

#### Keyword\_uk\_nhs\_number1

```
patient ID
patient identification
patient no
patient number
```

#### Keyword\_uk\_nhs\_number\_dob

```
GP
DOB
D.O.B
Date of Birth
Birth Date
```

## U.K. national insurance number (NINO)

This sensitive information type entity is included in the EU National Identification Number sensitive information type and is available as a stand-alone sensitive information type entity.

### Format

seven characters or nine characters separated by spaces or dashes

### Pattern

two possible patterns:

- two letters (valid NINOs use only certain characters in this prefix, which this pattern validates; not case sensitive)
- six digits
- either 'A', 'B', 'C', or 'D' (like the prefix, only certain characters are allowed in the suffix; not case sensitive)

OR

- two letters
- a space or dash
- two digits
- a space or dash
- two digits
- a space or dash
- two digits
- a space or dash
- either 'A', 'B', 'C', or 'D'


### Keywords

#### Keyword\_uk\_nino

```
national insurance number
national insurance contributions
protection act
insurance
social security number
insurance application
medical application
social insurance
medical attention
social security
Great Britain
NI Number
NI No.
NI #
NI#
insurance#
insurance number
national insurance#
nationalinsurancenumber
```

## U.K. Unique Taxpayer Reference Number

This sensitive information type is only available for use in:

- data loss prevention policies
- communication compliance policies
- information governance
- records management
- Microsoft cloud app security

### Format

10 digits without spaces and delimiters

### Pattern

10 digits

### Keywords

#### Keywords\_uk\_eu\_tax\_file\_number

```
tax number
tax file
tax ID
tax identification no
tax identification number
tax no#
tax no
tax registration number
tax ID#
tax ID no#
tax ID number#
tax no#
tax number#
tax number
tin ID
tin no
tin#
```

## U.S. bank account number

### Format

6-17 digits

### Pattern

6-17 consecutive digits

### Keywords

#### Keyword\_usa\_Bank\_Account

```
Checking Account Number
Checking Account
Checking Account #
Checking Acct Number
Checking Acct #
Checking Acct No.
Checking Account No.
Bank Account Number
Bank Account #
Bank Acct Number
Bank Acct #
Bank Acct No.
Bank Account No.
Savings Account Number
Savings Account.
Savings Account #
Savings Acct Number
Savings Acct #
Savings Acct No.
Savings Account No.
Debit Account Number
Debit Account
Debit Account #
Debit Acct Number
Debit Acct #
Debit Acct No.
Debit Account No.
```

## U.S. driver's license number

### Format

Depends on the state

### Pattern

depends on the state--for example, New York:

- nine digits formatted like ddd will match.
- nine digits like ddddddddd will not match.

### Keywords

#### Keyword\_us\_drivers\_license\_abbreviations

```
DL
DLS
CDL
CDLS
ID
IDs
DL#
DLS#
CDL#
CDLS#
ID#
IDs#
ID number
ID numbers
LIC
LIC#
```

#### Keyword\_us\_drivers\_license

```
DriverLic
DriverLics
DriverLicense
DriverLicenses
Driver Lic
Driver Lics
Driver License
Driver Licenses
DriversLic
DriversLics
DriversLicense
DriversLicenses
Drivers Lic
Drivers Lics
Drivers License
Drivers Licenses
Driver'Lic
Driver'Lics
Driver'License
Driver'Licenses
Driver' Lic
Driver' Lics
Driver' License
Driver' Licenses
Driver'sLic
Driver'sLics
Driver'sLicense
Driver'sLicenses
Driver's Lic
Driver's Lics
Driver's License
Driver's Licenses
identification number
identification numbers
identification #
ID card
ID cards
identification card
identification cards
DriverLic#
DriverLics#
DriverLicense#
DriverLicenses#
Driver Lic#
Driver Lics#
Driver License#
Driver Licenses#
DriversLic#
DriversLics#
DriversLicense#
DriversLicenses#
Drivers Lic#
Drivers Lics#
Drivers License#
Drivers Licenses#
Driver'Lic#
Driver'Lics#
Driver'License#
Driver'Licenses#
Driver' Lic#
Driver' Lics#
Driver' License#
Driver' Licenses#
Driver'sLic#
Driver'sLics#
Driver'sLicense#
Driver'sLicenses#
Driver's Lic#
Driver's Lics#
Driver's License#
Driver's Licenses#
ID card#
ID cards#
identification card#
identification cards#
```

#### Keyword\_[state\_name]\_drivers\_license\_name

- state abbreviation (for example, &quot;NY&quot;)
- state name (for example, &quot;New York&quot;)

## U.S. individual taxpayer identification number (ITIN)

### Format

nine digits that start with a &quot;9&quot; and contain a &quot;7&quot; or &quot;8&quot; as the fourth digit, optionally formatted with spaces or dashes

### Pattern

formatted:

- the digit &quot;9&quot;
- two digits
- a space or dash
- a &quot;7&quot; or &quot;8&quot;
- a digit
- a space, or dash
- four digits

unformatted:

- the digit &quot;9&quot;
- two digits
- a &quot;7&quot; or &quot;8&quot;
- five digits

### Keywords

#### Keyword\_itin

```
taxpayer
tax ID
tax identification
itin
i.t.i.n.
ssn
tin
social security
tax payer
itins
tax ID
individual taxpayer
```

## U.S. social security number (SSN)

### Format

nine digits, which may be in a formatted or unformatted pattern

>[!Note]
> If issued before mid-2011, an SSN has strong formatting where certain parts of the number must fall within certain ranges to be valid (but there's no checksum).
>

### Pattern

four functions look for SSNs in four different patterns:

- Func\_ssn finds SSNs with pre-2011 strong formatting that are formatted with dashes or spaces (ddd-dd-dddd OR ddd dd dddd)
- Func\_unformatted\_ssn finds SSNs with pre-2011 strong formatting that are unformatted as nine consecutive digits (ddddddddd)
- Func\_randomized\_formatted\_ssn finds post-2011 SSNs that are formatted with dashes or spaces (ddd-dd-dddd OR ddd dd dddd)
- Func\_randomized\_unformatted\_ssn finds post-2011 SSNs that are unformatted as nine consecutive digits (ddddddddd)

### Keywords

#### Keyword\_ssn

```
SSA Number
social security number
social security #
social security#
social security no
Social Security#
Soc Sec
SSN
SSNS
SSN#
SS#
SSID
```

## U.S. / U.K. passport number

The U.K. passport number sensitive information type entity is available in the EU Passport Number sensitive information type and is available as a stand-alone sensitive information type entity.

### Format

nine digits

### Pattern

nine consecutive digits

### Keywords

#### Keyword\_passport

```
Passport Number
Passport No
Passport #
Passport#
PassportID
Passport no
passport number
パスポート
パスポート番号
パスポートのNum
パスポート＃
Numéro de passeport
Passeport n °
Passeport Non
Passeport #
Passeport#
PasseportNon
Passeportn °
```
