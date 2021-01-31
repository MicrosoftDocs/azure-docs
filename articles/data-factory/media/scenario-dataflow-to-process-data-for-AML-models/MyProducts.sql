--create a table MyProducts
CREATE TABLE [dbo].[MyProducts](
	[ID] [int] NULL,
	[Col1] [char](124) NULL,
	[Col2] [char](124) NULL,
	[Col3] datetime NULL,
	[Col4] int NULL

) 

-- insert into 8 rows in this tutorial
INSERT INTO [MyProducts] VALUES	(1,'WA','Seattle','2019-01-31',100),
									(2,'WA','King','2019-02-15',101),
									(3,'WA','Seattle','2019-12-16',102),
									(4,'WA','Seattle','2019-03-17',103),
									(5,'WA','Seattle','2019-04-18',104),
									(6,'WA','Seattle','2019-05-19',105),
									(7,'OR','Portland','2019-06-20',106),
									(8,'OR','Portland','2019-07-21',107),
									(9,'OR','Eugenne','2019-08-22',1000), 
									(10,'OR','Portland','2019-09-23',1001),
									(11,'OR','Portland','2019-10-24',1009), 
									(12,'OR','Portland','2019-11-25',10010)

SELECT * FROM [dbo].[MyProducts]

--DROP TABLE
DROP TABLE [MyProducts]

