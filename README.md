### Initialize the project

#### Database

- Our database of choice is `PostgreSQL`
- For ORM we'll go with `TypeORM`

#### API

- Prefixed with `/api`

### Authentication

- Implement an auth guard to make sure the `X-UBID` header matches the requested ubid

### Update occupancy

- Create a table named `house_histories` to store the history of residence
- The new table will reference `ubid`, which is not the primary key, so instead of creating a foreign key we just store it as a normal column
- Whenever update the occupancy of a house, add a history record
- Using transaction to ensure data consistency
