#include<iostream>
#include<set>
using namespace std;

int a[10] = {11,12,11,13,11,13,14,15,12,14};
set<int> k;

int main() {
    for(int i = 0; i < 10; i++) {
        for(int j = i + 1; j < 10; j++) {
            if(a[i] == a[j]) {
                k.insert(a[i]);
            }
        }
    }

    cout << "Duplicate elements are: ";
    for(int x : k) {
        cout << x << " ";
    }

    return 0;
}