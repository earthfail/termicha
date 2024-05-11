#include <ncurses.h>

int main(int argc, char *argv[])
{
    initscr();
    printw("Salam Sailor !!");
    refresh();
    getch();
    endwin();
    
    return 0;
}
