# DASS Course Project
## Reddit Clone- Greddiit (Social Media WebApp)
### Akshit Sharma (2021101029)

### Commands to run:
From the assignment folder, run each:-
> cd backend; nodemon app.js
</br>

> cd frontend; npm start

To build docker image, run :
> sudo docker-compose up --build

Run the container with:
> sudo docker-compose up
</br>

## Part-1 link:
> https://mellow-mandazi-0bbda7.netlify.app
</br>

## Login and Registration (Path: /)
- Assuming that both Username and Email address of the user are unique. If a user registers with already registered Username or Email, an appropriate alert is shown.

- If input field is empty or data type of field is ivalid, an appropriate alert is shown.

- Local storage stores jwt token and remembers user if not logged out. This works even on system restart. 

- Hashing of password done using Bcrypt

- Routes have been protected

- Login and Register on same path, button to switch between login and register on top right in nav-bar.

## Dashboard (Path: /home)
- Buttons in navbar: Profile, SubGreddiits, Saved Posts and Logout.

- Dashboard page shows My SubGreddiits.

- New subgreddiit is created by clicking 'New Sub Greddiit' button below navbar. Approprite form renders on screen, removing my subgreddiits.

- name of SubGreddiit is taken to be unique

- Changes can be made to user credentials in profile page by editing the fields and clicking save. Followers and Following can be seen and removed from drop downs in profile.

- A subgreddiit can be opened to show further information about it using the open button on bottom right.

- This page shows nav bar having buttons for users, join reqests, stats and reported posts.

- Saved Posts has list of all the saved posts of the user. A saved post can be deleted by using the bin button on bottom. This will only remove it from saved data of the user.

- Option to delete my subgreddiit is given on the box showing the subgreddiit on bottom right. It deletes all the subgreddiit related data.

## SubGreddiit Page (Path: /home/SubGreddiit)
- Fuzzy search implemented using Fuse.js. There is a search bar below the nav bar for this purpose.

- Below it, a toggle button for adding tags to filter the search is given. Enter a tag and then click add. This will diplay the added tag on the bottom and filter the search to show only those subgreddiits which have the tags selected.

- The search can be sorted using the given parameters. Default shows the original display where the subgreddiits joined by the user are displayed before the ones not joined. We can sort, use fuzzy search and add tags simultaneously also. The ones not joined will show a join button on bottom. The ones joined will show a leave button. Once left the user can not join the subgreddiit again.

- Below this, we display the individual subgreddiits. There is an open button on the bottom to open any subgreddiit.

- The Subgreddiit page that shows up will display the features of adding post/ viewing them as well as commenting to only the users of the subgreddiit i.e. if you have not joined it, you can't do these.

- The main page of a subgreddiit has a fixed photo and description on left. There is a create post button which pops up a modal.

## Navbar
- has buttons containing icons as well as text

- back button also implemented in some pages

## Users Page (Path: /home/:name/Users where name is Subgreddiit name)
- Listed all users that are not blocked first in white background

- Then the blcoked users are listed in red

## Reported Page (Path: /home/:name/Reports where name is Subgreddiit name)
- Reports than have been unnoticed for more than 10 days are not displayed (filtered at backend). The no. of days can be varied from 10.

- If ignored, all 3 buttons are disabled

- Block User adds the user to Blocked Users list and causes the name to appear as "Blocked User" when viewed elsewhere. The button when clicked says "Cancel 3,2,1" and then the user gets blocked.

- Delete post removes the post and the request.

- Email notification sent to reported person as well as the reporter for all 3 cases (Bonus).(nodemailer used)

## Join Requests (Path: /home/:name/JoinReq where name is Subgreddiit name)
- Accept or Reject option. Clicking any of these will remove the request and will take appropriate action.

## Stats (Path: /home/:name/Stats where name is Subgreddiit name)
- Used chart.js and react-chartjs-2 to crease line graphs for all 4 scenarios (Bonus).

- For the graph of Number of reported posts vs actually deleted posts based on reports, I have plotted the growth of reported users vs time as well as the blocked users vs time for that subgreddiit on the same graph.

- Time in x-axis accross all graphs is taken as unique dates of activity.

## DOCKER
- Files Created- Dockerfile in both frontend and backend folders to list the commands to be followed by the container like the version of node, how to install node_modules, how to start the servers,etc.

- nginx folder to create a reverse proxy server (port 8080). (has local.conf file)
