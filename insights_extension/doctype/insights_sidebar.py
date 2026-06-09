import orbit7
from orbit7.model.document import Document
from insights_extension.api import clear_sidebar_cache

class InsightsSidebar(Document):
    def on_update(self):
        clear_sidebar_cache(self.workspace)

    def on_trash(self):
        clear_sidebar_cache(self.workspace)