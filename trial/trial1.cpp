#include<iostream>
using namespace std;
vector<int> page_table(int size)
{
    int n=(size*1024)/4;//no of pages
    vector<int>arr(n);
    for(int i=0;i<n;i++)
    {
        arr[i]=i;
    }
    return arr;
}
int main()
{//page table creation
    int process;
    cin>>process;
    vector<vector<int>>processes(process);
    for(int i=0;i<process;i++)
    {
        int size;//file size
        cin>> size;
        processes[i]=page_table(size);
    }
}