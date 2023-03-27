frontend の方で、backend で使用しているデータベース定義を取得する方法

下記コマンドを打ち込むと、実DBからテーブルの方を取得して、prisma/schema.prisma に型を自動反映させることができる。
```
npx prisma db pull
```

「npx prisma db pull」で取得したdbの型をコード内で使用できるようにする
```
npx prisma generate
```