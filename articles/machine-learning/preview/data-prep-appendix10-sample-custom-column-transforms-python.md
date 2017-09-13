---
title: Sample of Custom Column Transforms (Python) | Microsoft Docs
description: Gives samples of python custom column transforms
author: cforbe
ms.author: cforbe@microsoft.com
ms.date: 9/7/2017
---

Before reading this appendix read [Python Extensibility Overview](data-prep-python-extensibility-overview.md)
# Sample of Custom Column Transforms (Python) #



## Add Column ##

The following formats for referencing a column produce the same results
```python
    row.Col1 + row.Col2 is the same as row["Col1"] + row["Col2"]
```
If the value in Col1 is less then 4 then the new column should have a value of 1 else it has the value 2

```python
    1 if row.Col1 < 4 else 2
```

Insert the current date and time

```python
    datetime.datetime.now()
```

Typecast 2 numbers and then divide them and remove 1
```python
    float(row.Col1) / float(row.Col2 - 1)
```

If the Col1 contains a null then mark the new column as Bad otherwise mark it as Good

```python
    'Bad' if pandas.isnull(row.Col1) else 'Good'
```
New column is a natural log of Col1
```python
    np.log(row.Col1)
```
Number of seconds since the Unix Epoch (assuming Col1 is already a date)
```python
    row.Col1 - datetime.datetime.utcfromtimestamp(0)).total_seconds()
```





