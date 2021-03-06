import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Pet } from '../../models/entry';
import { EntryDetailPage } from '../entry-detail/entry-detail';
import { TaskPage } from '../task/task';
import { EntryDataServiceProvider } from '../../providers/entry-data-service/entry-data-service';
import { AlertController } from 'ionic-angular';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public entries: Pet[] = [];

  
  constructor(public navCtrl: NavController,
    public entryDataService: EntryDataServiceProvider,
    private alertCtrl: AlertController)  {

      this.entryDataService.getObservable().subscribe(update => {
        this.entries = entryDataService.getEntries();
        console.log(this.entries)


        for (let e of this.entries) {
          if (typeof e.timestamp === 'string') {
          
            e.timestamp = new Date(e.timestamp);
          }
        }

      this.entries.sort((a: Pet, b: Pet) => {
        return a.timestamp.getTime() - b.timestamp.getTime()
      }).reverse();
      console.log(this.entries);
    });

      }

  ngOnInit() {
    this.entries = this.entryDataService.getEntries();
  }
  
  private addEntry() {
    this.navCtrl.push(EntryDetailPage);
  }


private editEntry(petID: number) {
  console.log("editing entry ", petID);
  this.navCtrl.push(EntryDetailPage, {"entryID": petID});
}

private deleteEntry(petID: number) {
  this.entryDataService.removeEntry(petID)
  console.log('deleting entry', petID)
}

private seeTasks(petID: number) {
  this.navCtrl.push(TaskPage, {"petID": petID});
  console.log('hello')
}




}

