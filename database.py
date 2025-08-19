import psycopg2

conn = psycopg2.connect("dbname=test user=postgres password=pass")
cur = conn.cursor()

query = "SELECT * FROM students WHERE id=1;"
# Check ML model
risk = model.predict(featurize(query))
if risk == 0:
    cur.execute(query)
    print(cur.fetchall())
else:
    print("Query blocked 🚨")